const PrettyBannerPlugin = require('./PrettyBannerPlugin');

module.exports = targets => {
    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        const { description } = require(compiler.context + '/package.json');
        const bannerPlugin = new PrettyBannerPlugin(description);

        compiler.hooks.afterPlugins.tap(targets.name, compiler => {
            bannerPlugin.apply(compiler);
        });
    });
};
