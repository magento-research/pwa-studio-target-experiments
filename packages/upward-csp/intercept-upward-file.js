const path = require('path');
const fs = require('fs');
const jsYaml = require('js-yaml');

const UPWARD_FILENAME = 'upward.yml';

const DEF_NAME = 'pwaExperimentContentSecurityPolicy';

module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');

    builtins.webpackCompiler.tap(compiler => {
        compiler.hooks.emit.tapPromise({
            name: targets.name,
            stage: 2,
            async fn(compilation) {
                const upwardAsset = compilation.assets[UPWARD_FILENAME];
                if (upwardAsset) {
                    const definitions = jsYaml.safeLoad(upwardAsset.source());

                    const cspDefinitions = jsYaml.safeLoad(
                        await fs.promises.readFile(
                            path.resolve(__dirname, 'upward.yml'),
                            'utf8'
                        )
                    );

                    Object.assign(definitions, cspDefinitions);

                    definitions.veniaAppShell.inline.headers.inline[
                        'Content-Security-Policy-Report-Only'
                    ] = DEF_NAME;

                    const newSource = jsYaml.safeDump(definitions);
                    const newSourceSize = Buffer.from(newSource).byteLength;
                    compilation.assets[UPWARD_FILENAME] = {
                        size() {
                            return newSourceSize;
                        },
                        source() {
                            return newSource;
                        }
                    };
                }
            }
        });
    });
};
