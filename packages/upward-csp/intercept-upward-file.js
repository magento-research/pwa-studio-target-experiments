const jsYaml = require('js-yaml');

const UPWARD_FILENAME = 'upward.yml';

const DEF_NAME = 'pwaExperimentContentSecurityPolicy';

const setVeniaCsp = definitions => {
    definitions.veniaAppShell.inline.headers.inline[
        'Content-Security-Policy'
    ] = DEF_NAME;
};

module.exports = targets => {
    const { webpackCompiler, specialFeatures } = targets.of(
        '@magento/pwa-buildpack'
    );

    specialFeatures.tap(features => {
        features[targets.name] = { upward: true };
    });

    webpackCompiler.tap(compiler => {
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

                    setVeniaCsp(definitions);

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
