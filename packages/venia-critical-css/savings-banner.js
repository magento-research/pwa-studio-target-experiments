const figlet = require('figlet');

const wrapComment = str =>
    `\n\n/*!\n * ${str
        .replace(/\*\//g, '* /')
        .split('\n')
        .join('\n *     ')}\n */\n\n`;

const kb = bytes => (bytes / 1000).toFixed(1) + 'kB';

const holler = txt =>
    figlet
        .textSync(txt, {
            font: 'Univers',
            horizontalLayout: 'full'
        })
        .split('\n')
        .filter(n => n.trim())
        .join('\n');

const brag = ({ name, modules, saved }) => {
    const banner = `
${name}: Inlining stylesheets from ${modules.length} Venia components saved you

${holler(saved.requests + ' requests')}

${holler('and ' + kb(saved.bytes))}

minus the additional`;

    return wrapComment(
        `${banner} ${kb(banner.length)} from this stupid banner.`
    );
};

module.exports = brag;
