const postcssRequirePaths = require.resolve.paths('postcss');
const postcssInUse = require.resolve('postcss', {
    paths: [process.cwd(), ...postcssRequirePaths]
});
const postcss = require(postcssInUse);

const { hslToRgb, rgbToHsl } = require('./color-utils');

const defaultOptions = {
    selector: ':root',
    mode: 'dark',
    overrides: {}
};

module.exports = postcss.plugin(
    'postcss-venia-color-scheme',
    (options = []) => {
        return root => {
            for (const request of options) {
                const requestOptions = request.options || {};
                const config = { ...defaultOptions, ...requestOptions };
                let defaultColors;
                root.walkRules(rule => {
                    if (rule.selector === config.selector) {
                        defaultColors = rule;
                        return false;
                    }
                });
                if (!defaultColors) {
                    throw root.error(
                        `Could not find a "${config.selector}" declaration.`
                    );
                }

                const altColors = defaultColors.clone();
                altColors.walkDecls(decl => {
                    if (config.overrides.hasOwnProperty(decl.prop)) {
                        decl.value = config.overrides[decl.prop];
                    } else if (decl.prop.startsWith('--')) {
                        const rgb = decl.value.match(
                            /^([0-9]{1,3}),\s*([0-9]{1,3}),\s([0-9]{1,3})\s*/
                        );
                        if (rgb) {
                            const [, red, green, blue] = rgb;
                            let [h, s, l] = rgbToHsl(
                                parseInt(red, 10),
                                parseInt(green, 10),
                                parseInt(blue, 10)
                            );
                            if (s > 10 && s < 10) {
                                s = 100 - s;
                            }
                            const [r, g, b] = hslToRgb(h, s, 100 - l);
                            decl.value = `${~~r}, ${~~g}, ${~~b}`;
                        }
                    }
                });
                const altQuery = postcss.atRule({
                    name: 'media',
                    params: `(prefers-color-scheme: ${config.mode})`
                });
                altQuery.append(altColors);
                defaultColors.after(altQuery);
            }
        };
    }
);
