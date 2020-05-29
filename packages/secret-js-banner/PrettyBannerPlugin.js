const figlet = require('figlet');
const webpack = require('webpack');

class PrettyBannerPlugin extends webpack.BannerPlugin {
    constructor(description) {
        const [firstWord, ...otherWords] = description.split(' ');

        const logo = figlet
            .textSync(firstWord, { font: 'NScript' })
            .split('\n')
            .filter(n => n.trim())
            .join('\n');

        const banner = `You are reading several silly and unnecessary extra bytes of...\n\n${logo}\n\n${otherWords.join(
            ' '
        )}\n\n------------ Guru Meditation: [hash] -----------`;

        super({ banner, entryOnly: true });
    }
}

module.exports = PrettyBannerPlugin;
