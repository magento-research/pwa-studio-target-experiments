import React from 'react';
import gql from 'graphql-tag';
import styles from './blog.module.css';
import ArticlePreview from '../components/article-preview';
import { useQuery } from '@apollo/react-hooks';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

export const pageQuery = gql`
    query ContentfulIndexQuery {
        allContentfulBlogPost(sort: { fields: [publishDate], order: DESC }) {
            edges {
                node {
                    title
                    slug
                    publishDate(formatString: "MMMM Do, YYYY")
                    tags
                    heroImage {
                        fluid(
                            maxWidth: 400
                            maxHeight: 196
                            resizingBehavior: FILL
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
    const { loading, error, data } = useQuery(pageQuery, {});

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
        <div className={styles.root}>
            <h2 className={styles.hero}>Blog</h2>
            <h2 className={styles.section_headline}>Recent articles</h2>
            <div className={styles.wrapper}>
                <ul className={styles.article_list}>
                    {posts.map(({ node }) => {
                        return (
                            <li key={node.slug}>
                                <ArticlePreview article={node} />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default BlogIndex;
