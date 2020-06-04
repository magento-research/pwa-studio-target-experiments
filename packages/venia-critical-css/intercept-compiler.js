const VeniaCriticalCssPlugin = require('./critical-plugin');

const defaultComponents = [
    'clickable',
    'Button',
    'Main',
    'Mask',
    'Footer',
    'Header',
    'Icon',
    'Image',
    'LoadingIndicator',
    'Logo',
    'ToastContainer',
    'RichContent',
    'Navigation'
];

module.exports = targets => {
    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        if (compiler.options.mode === 'production') {
            const components = new Set(defaultComponents);

            targets.own.criticalVeniaComponents.call(components);

            new VeniaCriticalCssPlugin({
                name: targets.name,
                components: Array.from(components)
            }).apply(compiler);
        }
    });
};
