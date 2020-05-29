module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');

    builtins.envVarDefinitions.tap(defs => {
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

    builtins.specialFeatures.tap(features => {
        features[targets.name] = {
            esModules: true,
            cssModules: true
        };
    });

    const venia = targets.of('@magento/venia-ui');

    venia.navItems.tap(navItems => [
        ...navItems,
        {
            name: 'Blog',
            to: '/blog'
        }
    ]);

    venia.routes.tap(routes => [
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

    venia.apolloLinks.tap(linkWrappers =>
        linkWrappers.concat(targets.name + '/lib/add-contentful-endpoint.js')
    );

    return targets;
};
