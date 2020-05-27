const Color = require('color');

function rgbToHsl(r, g, b) {
    return Color.rgb([r, g, b])
        .hsl()
        .array();
}

function hslToRgb(h, s, l) {
    return Color.hsl([h, s, l])
        .rgb()
        .array();
}

function validColorToVar(...colorArgs) {
    return Color(...colorArgs)
        .rgb()
        .array()
        .join(', ');
}

const friendlyColorToVarName = friendlyName =>
    `--venia-${friendlyName.replace(/[A-Z]/g, l => '-' + l.toLowerCase())}`;

module.exports = {
    friendlyColorToVarName,
    hslToRgb,
    rgbToHsl,
    validColorToVar
};
