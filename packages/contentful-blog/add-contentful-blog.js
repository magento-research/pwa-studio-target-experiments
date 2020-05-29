module.exports = targets => {
    const { envVarDefinitions, specialFeatures, webpackCompiler } = targets.of(
        '@magento/pwa-buildpack'
    );
    const { navItems, routes, apolloLinks } = targets.of('@magento/venia-ui');

    envVarDefinitions.tap(defs => {
        defs.sections.push({
            name: 'Contentful',
            variables: [
                {
                    name: 'CONTENTFUL_GRAPHQL_ENDPOINT',
                    type: 'str',
                    desc: 'Specify the GraphQL endpoint for Contentful',
                    default: ''
                }
            ]
        });
    });
    specialFeatures.tap(features => {
        features[targets.name] = {
            esModules: true,
            cssModules: true
        };
    });

    navItems.tap(navItems => [
        ...navItems,
        {
            name: 'Blog',
            to: '/blog'
        }
    ]);

    routes.tap(routes => [
        ...routes,
        {
            name: 'Blog',
            pattern: '/blog',
            path: targets.name + '/lib/pages/blog.js',
            exact: true
        },
        {
            name: 'BlogPost',
            pattern: '/blog/:slug',
            path: targets.name + '/lib/pages/blog-post.js'
        }
    ]);

    apolloLinks.tap(linkWrappers =>
        linkWrappers.concat(targets.name + '/lib/add-contentful-endpoint.js')
    );

    // handle npm link resolution for remote components
    webpackCompiler.tap(compiler => {
        const toResolve = [
            '@apollo/react-hooks',
            '@magento/venia-ui/lib/components/LoadingIndicator',
            'apollo-link',
            'apollo-link-http',
            'react',
            'react-router-dom'
        ];

        toResolve.forEach(dep => {
            compiler.options.resolve.alias[dep] = require.resolve(dep, {
                paths: [compiler.options.context, ...require.resolve.paths(dep)]
            });
        });
    });

    return targets;
};
