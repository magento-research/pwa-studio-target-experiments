import React from 'react';
import { Link } from 'react-router-dom';
import styles from './article-preview.css';

export default ({ article }) => {
    return (
        <div className={styles.preview}>
            <picture className={styles.image}>
                <source {...article.heroImage.fluid} />
                <img alt="" {...article.heroImage.fluid} />
            </picture>
            <h3 className={styles.previewTitle}>
                <Link to={`/blog/${article.slug}`}>{article.title}</Link>
            </h3>
            <small>{article.publishDate}</small>
            <p
                dangerouslySetInnerHTML={{
                    __html: article.description.childMarkdownRemark.html
                }}
            />
        </div>
    );
};
