/**
 * Convenience script to directly symlink this repository and its dependencies
 * back to the PWA project.
 */
const { inspect, promisify } = require('util');
const path = require('path');
const fs = require('fs');
const childP = require('child_process');
const execP = promisify(childP.exec);
const noop = () => {};

async function linkTo(pwaPath, verboseFlag) {
    const verbose = ['-v', '--verbose'].includes(verboseFlag);
    const log = verbose ? (...args) => console.warn(...args) : noop;

    const exec = verbose
        ? async (cmd, opts) => {
              const result = await execP(cmd, opts);
              process.stdout.write(result.stdout);
              process.stderr.write(result.stderr);
              return result;
          }
        : execP;

    const execToJson = async (cmd, opts) => {
        const result = await execP(cmd, opts);
        try {
            return JSON.parse(result.stdout);
        } catch (e) {
            const noisyParseError = new Error(
                `Could not JSON.parse output of command:
    ${cmd}
executed with options: ${inspect(opts)}.
It returned: ${inspect(result)}

JSON.parse(stdout) failed with: ${e.message}`
            );
            noisyParseError.result = result;
            throw noisyParseError;
        }
    };

    const printList = list => `\n\t${list.join('\n\t')}\n`;

    const getWorkspaces = async () => {
        const workspaces = new Map();
        for (const [name, info] of Object.entries(
            await execToJson('yarn -s workspaces info')
        )) {
            info.name = name;
            workspaces.set(name, info);
        }
        return workspaces;
    };

    const pathsCache = new Map();
    const getResolvePathsOf = async cwd => {
        if (!pathsCache.has(cwd)) {
            pathsCache.set(
                cwd,
                await execToJson(
                    `${
                        process.execPath
                    } -p 'JSON.stringify(require.resolve.paths("_"))'`,
                    { cwd }
                )
            );
        }
        return pathsCache.get(cwd);
    };

    const getPwaLinkTargetPath = async pwaPath => {
        if (!pwaPath) {
            throw new Error(
                `Cannot link: Must provide the project path of the PWA to link to.`
            );
        }
        try {
            await fs.promises.readFile(path.join(pwaPath, 'package.json'));
        } catch (e) {
            throw new Error(
                `Cannot link: "${pwaPath}" does not appear to be a valid project folder. ${
                    e.message
                }`
            );
        }

        const paths = await getResolvePathsOf(pwaPath);

        for (const modulePath of paths) {
            try {
                await fs.promises.readdir(modulePath);
                return modulePath;
            } catch (e) {
                continue;
            }
        }
        throw new Error(
            `Cannot link: Could not find an existing directory in any of these paths: ${printList(
                paths
            )}`
        );
    };

    const getPeerDependenciesOf = workspaceDir => {
        const { peerDependencies = {} } = require(path.resolve(
            workspaceDir,
            'package.json'
        ));
        return Object.keys(peerDependencies);
    };

    const resolveDependencyIn = async (dep, project) =>
        path.dirname(
            require.resolve(path.join(dep, 'package.json'), {
                paths: await getResolvePathsOf(project)
            })
        );

    const safeLink = async (source, target) => {
        const args = `--non-interactive --link-folder ${target}`;
        const opts = {
            cwd: source,
            env: Object.assign({}, process.env, { FORCE_COLOR: 1 })
        };

        await execP(`yarn unlink ${args}`, opts).catch(noop);

        await exec(`yarn link ${args}`, opts);
    };

    const [pwaModulePath, workspaces] = await Promise.all([
        getPwaLinkTargetPath(pwaPath),
        getWorkspaces()
    ]);

    log(`\nLinking to ${pwaModulePath}`);

    const linkbacksAttempted = new Set();
    const linkbacksDone = new Set();
    const linkbacksFailed = new Set();

    const ourModules = path.resolve(__dirname, '..', 'node_modules');

    await Promise.all(
        [...workspaces.values()].map(async workspace => {
            const workspaceDir = path.resolve(
                __dirname,
                '..',
                workspace.location
            );

            await safeLink(workspaceDir, pwaModulePath);

            const peerDeps = getPeerDependenciesOf(workspaceDir).filter(
                dep => !linkbacksAttempted.has(dep)
            );

            if (peerDeps.length === 0) return;

            log(`\nBack-linking peer dependencies of ${workspace.name}...\n`);
            await Promise.all(
                peerDeps.map(async dep => {
                    linkbacksAttempted.add(dep);
                    let depDir;
                    try {
                        depDir = await resolveDependencyIn(dep, pwaPath);
                    } catch (e) {
                        linkbacksFailed.add(dep);
                    }
                    await safeLink(depDir, ourModules);
                    linkbacksDone.add(dep);
                })
            );
        })
    );

    log(
        `Back-linked ${
            linkbacksDone.size
        } peer dependencies from ${pwaPath}: ${printList([...linkbacksDone])}`
    );

    if (linkbacksFailed.size > 0) {
        log(
            `WARNING: The following peer deps were NOT FOUND in ${pwaPath}: ${printList(
                [...linkbacksFailed]
            )}`
        );
    }
}

linkTo(...process.argv.slice(2)).catch(e => {
    console.error(e);
    process.exit(1);
});
