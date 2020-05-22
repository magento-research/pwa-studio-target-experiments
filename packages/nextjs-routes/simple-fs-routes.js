const { basename, relative, resolve } = require('path');
const glob = require('glob');

const { PAGE_DIR } = require('./constants');

// https://nextjs.org/docs/routing/dynamic-routes
const catchAll = /\/\[\.\.\.([A-Za-z0-9_]+)\]/g;
const param = /\/\[([A-Za-z0-9_]+)\]/g;
const convertNextPathToRoute = nextPath => {
    return nextPath.replace(catchAll, '/:$1+').replace(param, '/:$1');
};

module.exports = targets => {
    const { routes } = targets.of('@magento/venia-ui');

    routes.tap(routeArray => {
        const routeBase = resolve(process.cwd(), PAGE_DIR);
        const pages = glob.sync('**/*.js', { cwd: routeBase, absolute: true });
        return routeArray.concat(
            pages.map((path, i) => {
                const relPath = relative(routeBase, path).replace(
                    /\.[jt]sx?$/,
                    ''
                );
                return {
                    name: `GeneratedPage_${basename(relPath)}${i}_`,
                    pattern: `/${convertNextPathToRoute(relPath)}`,
                    path
                };
            })
        );
    });

    return targets;
};
