const glob = require('glob');
module.exports = targets => {
    const { webpackResolver } = targets.of('@magento/pwa-buildpack');
    const { routes } = targets.of('@magento/venia-ui');

    let nextRoutes;
    webpackResolver.tapPromise(async resolver => {});

    routes.tap(routeArray => {
        glob.sync();
    });
};
