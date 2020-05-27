const { friendlyColorToVarName, validColorToVar } = require('./color-utils');

module.exports = targets => {
    targets.own.darkColors.tap(colors => ({
        ...colors,
        backgroundColor: '#2d2d3d'
    }));

    targets.of('@magento/pwa-buildpack').transformModules.tap(addTransform => {
        const overrides = {};
        const darkColors = targets.own.darkColors.call({});
        Object.entries(darkColors).forEach(([friendlyName, validColor]) => {
            overrides[friendlyColorToVarName(friendlyName)] = validColorToVar(
                validColor
            );
        });
        addTransform({
            type: 'postcss',
            fileToTransform: './src/index.css',
            transformModule: require.resolve('./postcss-venia-color-scheme'),
            options: {
                overrides
            }
        });
    });
};
