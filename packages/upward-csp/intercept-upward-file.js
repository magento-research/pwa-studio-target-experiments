const path = require('path');
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
                    if (!definitions[DEF_NAME]) {
                        throw new Error(
                            `${
                                targets.name
                            } could not find its own definition in the emitted upward.yml`
                        );
                    }

                    definitions[DEF_NAME] = jsYaml.safeLoad(
                        path.resolve(__dirname, 'upward.yml')
                    );
                    definitions.veniaAppShell.inline.headers.inline[
                        'Content-Security-Policy'
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
