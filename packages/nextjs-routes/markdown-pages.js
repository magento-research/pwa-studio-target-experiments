const { resolve } = require('path');

const { PAGE_DIR } = require('./constants');

module.exports = targets => {
    const { webpackCompiler } = targets.of('@magento/pwa-buildpack');

    webpackCompiler.tap(({ options }) => {
        options.module.rules.unshift({
            enforce: 'pre',
            test: /\.md.[jt]sx?$/,
            include: resolve(options.context, PAGE_DIR),
            use: {
                loader: `@mapbox/jsxtreme-markdown-loader`
            }
        });
    });

    return targets;
};
