const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const savingsBanner = require('./savings-banner');

const assetExtension = '.critical.css';

class VeniaCriticalCssPlugin {
    constructor({ name, components }) {
        this.name = name;
        this.modules = components;
        this._criticalForCompilation = new WeakMap();
        this.saved = {
            bytes: 0,
            requests: 0
        };
    }
    apply(compiler) {
        this.compiler = compiler;

        new MiniCssExtractPlugin({
            filename: `[name]${assetExtension}`
        }).apply(compiler);

        this._insertLoader();
        this._collectStylesheets();
        this._injectInline();
    }
    _collectStylesheets() {
        this.compiler.hooks.emit.tap(this.name, compilation => {
            const stylesheets = [];
            for (const name of Object.keys(compilation.assets)) {
                if (name.endsWith(assetExtension)) {
                    const asset = compilation.assets[name];
                    stylesheets.push({
                        tagName: 'style',
                        innerHTML: asset.source(),
                        closeTag: true,
                        attributes: {
                            type: 'text/css',
                            'data-href': '/' + name
                        }
                    });
                    this.saved.bytes += asset.size();
                    this.saved.requests += 1;
                    delete compilation.assets[name];
                }
            }
            const top = stylesheets[0];
            if (top) {
                top.innerHTML = savingsBanner(this) + top.innerHTML;
                top.attributes['data-top'] = true;
            }
            this._criticalForCompilation.set(compilation, stylesheets);
        });
    }
    _injectInline() {
        this.compiler.hooks.compilation.tap({
            name: this.name,
            // Ensure this happens after other assets have been added.
            stage: 2,
            fn: compilation => {
                // Ensure that HtmlWebpackPlugin is minifying CSS at least.
                compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(
                    this.name,
                    ({ plugin: { options } }) => {
                        options.minify = options.minify || {};
                        options.minify.minifyCSS = true;
                    }
                );

                // Remove the external stylesheet link tags and replace them
                // with inline style tags.
                compilation.hooks.htmlWebpackPluginAlterAssetTags.tap(
                    this.name,
                    assetTags => {
                        const stylesheets = this._criticalForCompilation.get(
                            compilation
                        );
                        for (const stylesheet of stylesheets) {
                            // Is there a linked stylesheet we are replacing?
                            const linkTagIndex = assetTags.head.findIndex(
                                tag =>
                                    tag.tagName === 'link' &&
                                    tag.attributes &&
                                    tag.attributes.href &&
                                    tag.attributes.href.includes(
                                        stylesheet.attributes['data-href']
                                    )
                            );

                            if (linkTagIndex > -1) {
                                // If so, replace it.
                                assetTags.head.splice(
                                    linkTagIndex,
                                    1,
                                    stylesheet
                                );
                            } else if (stylesheet.attributes['data-top']) {
                                // If not, then is this the top stylesheet?
                                // If so, make it first.
                                assetTags.head.unshift(stylesheet);
                            } else {
                                // Otherwise, append it.
                                assetTags.head.push(stylesheet);
                            }
                        }
                    }
                );
            }
        });
    }
    _insertLoader() {
        const { options } = this.compiler;

        // Big regexp for matching all CSS files that are descendents of the
        // Venia modules mentioned in this.modules.
        // This assumes Venia's file structure.
        const matchComponentStylesheet = new RegExp(
            `venia-ui/lib/components/(${this.modules.join('|')}).*\\.css$`
        );

        // TODO: PR to Buildpack a better target for accessing Webpack config.
        // This is brittle; it approximates which rule is the CSS rule by
        // checking if its test seems to be a regexp matching a CSS file.
        // That'll only work if the rule happens to have a "test" regex, which
        // rules don't have to have.
        //
        // A better option would be to have a target specifically for setting
        // up the CSS rule.
        const cssRule = options.module.rules.find(({ test }) =>
            test.test('index.css')
        );

        // Add a preemptive condition to the css rule. If it matches, the file
        // won't go through the other CSS loaders...which is why we have to
        // reproduce the loader configuration here.
        cssRule.oneOf.unshift({
            test: [
                // The supplied modules
                matchComponentStylesheet,
                // The global stylesheet as well!
                path.resolve(options.context, 'src/index.css')
            ],
            use: [
                // This is where MiniCssExtractPlugin goes in place of the
                // `style-loader`.
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        esModule: true
                    }
                },
                {
                    loader: 'css-loader',
                    options: {
                        // A shorter ident name for production.
                        localIdentName: '[hash:base58:3]',
                        modules: true
                    }
                }
            ]
        });
    }
}

module.exports = VeniaCriticalCssPlugin;
