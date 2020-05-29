import React from 'react';
import gql from 'graphql-tag';
import styles from './blog-post.module.css';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

const postQuery = gql`
    query ContentfulBlogPost($slug: String!) {
        contentfulBlogPost(slug: { eq: $slug }) {
            title
            publishDate(formatString: "MMMM Do, YYYY")
            heroImage {
                fluid(maxWidth: 1180, background: "rgb:000000") {
                    srcSet
                    src
                    sizes
                }
            }
            body {
                childMarkdownRemark {
                    html
                }
            }
        }
    }
`;

function BlogPost() {
    const { slug } = useParams();
    const { loading, error, data } = useQuery(postQuery, {
        variables: { slug }
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

    const post = data.contentfulBlogPost;

    return (
        <div>
            <div className={styles.hero}>
                <picture>
                    <source {...post.heroImage.fluid} />
                    <img alt={post.title} {...post.heroImage.fluid} />
                </picture>
            </div>
            <div className={styles.post}>
                <h1 className={styles.section_headline}>{post.title}</h1>
                <p>{post.publishDate}</p>
                <div
                    dangerouslySetInnerHTML={{
                        __html: post.body.childMarkdownRemark.html
                    }}
                />
            </div>
        </div>
    );
}

export default BlogPost;
