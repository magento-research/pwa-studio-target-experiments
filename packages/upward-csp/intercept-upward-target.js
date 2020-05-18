const DEF_NAME = 'pwaExperimentContentSecurityPolicy';

module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');

    builtins.specialFeatures.tap(features => {
        features[targets.name] = { upward: true };
    });

    builtins.transformUpward.tapPromise(async defs => {
        if (!defs[DEF_NAME]) {
            throw new Error(
                `${
                    targets.name
                } could not find its own definition in the emitted upward.yml`
            );
        }

        definitions.veniaAppShell.inline.headers.inline[
            'Content-Security-Policy'
        ] = DEF_NAME;
    });
};
