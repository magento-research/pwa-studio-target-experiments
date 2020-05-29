import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
export default function wrapLink(original) {
    // With additive linking, we can use the same GraphQL client to talk to a
    // totally different API. We'll use a naming convention to denote queries
    // which should use the Contentful endpoint instead of the Magento endpoint.
    return (...args) =>
        ApolloLink.split(
            // Return true to use Contentful, false to use Magento.
            ({ operationName }) => operationName.startsWith('Contentful'),
            // Contentful HTTP link.
            createHttpLink({
                uri: process.env.CONTENTFUL_GRAPHQL_ENDPOINT
            }),
            // Magento HTTP link.
            original(...args)
        );
}
