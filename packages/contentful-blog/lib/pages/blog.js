import React from 'react';
import gql from 'graphql-tag';
import classes from './blog.module.css';
import styles from '../common.module.css';
import ArticlePreview from '../components/article-preview';
import { useQuery } from '@apollo/react-hooks';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

export const pageQuery = gql`
    query ContentfulIndexQuery(
        $maxWidth: Int!
        $maxHeight: Int!
        $previewSizes: String!
    ) {
        allContentfulBlogPost(sort: { fields: [publishDate], order: DESC }) {
            edges {
                node {
                    title
                    slug
                    publishDate(formatString: "MMMM Do, YYYY")
                    tags
                    heroImage {
                        fluid(
                            maxWidth: $maxWidth
                            maxHeight: $maxHeight
                            resizingBehavior: FILL
                            sizes: $previewSizes
                        ) {
                            srcSet
                            src
                            sizes
                        }
                    }
                    description {
                        childMarkdownRemark {
                            html
                        }
                    }
                }
            }
        }
    }
`;

function BlogIndex() {
    const maxWidth = Number(styles.listBreakpoint.replace(/[^\d\.]/g, ''));
    const variables = {
        maxWidth,
        maxHeight: ~~(maxWidth / 2.6),
        previewSizes: styles.previewSizes
    };
    const { loading, error, data } = useQuery(pageQuery, {
        variables
    });

    if (loading) {
        return fullPageLoadingIndicator;
    }

    if (error) {
        return (
            <div>
                Error fetching blog data:
                <code>
                    <pre>{error.stack}</pre>
                </code>
            </div>
        );
    }

    const posts = data.allContentfulBlogPost.edges;

    return (
        <div className={classes.root}>
            <h2 className={classes.hero}>Blog</h2>
            <h2 className={classes.section_headline}>Recent articles</h2>
            <ul className={classes.article_list}>
                {posts.map(({ node }) => {
                    return (
                        <li className={classes.article_item} key={node.slug}>
                            <ArticlePreview article={node} />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default BlogIndex;
