const webpack = require('webpack');
const figlet = require('figlet');

const makeBanner = compiler => {
    const pkg = require(compiler.context + '/package.json');

    const [firstWord, ...otherWords] = pkg.description.split(' ');

    const logo = figlet
        .textSync(firstWord, { font: 'NScript' })
        .split('\n')
        .filter(n => n.trim())
        .join('\n');

    const banner = `You are reading several silly and unnecessary extra bytes of...

${logo}

${otherWords.join(' ')}

------------ Guru Meditation: [hash] -----------`;
    return new webpack.BannerPlugin({
        banner,
        entryOnly: true
    });
};

module.exports = targets => {
    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        compiler.hooks.afterPlugins.tap(targets.name, compiler =>
            makeBanner(compiler).apply(compiler)
        );
    });
};
