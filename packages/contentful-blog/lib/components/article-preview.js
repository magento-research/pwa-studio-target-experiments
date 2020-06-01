import React from 'react';
import { Link } from 'react-router-dom';
import classes from './article-preview.css';

export default ({ article }) => {
    const { srcSet, src, sizes } = article.heroImage.fluid;
    return (
        <div className={classes.preview}>
            <Link to={`/blog/${article.slug}`}>
                <img
                    className={classes.image}
                    alt=""
                    srcSet={srcSet}
                    sizes={sizes}
                    src={src}
                />
                <h3 className={classes.previewTitle}>{article.title}</h3>
            </Link>
            <small>{article.publishDate}</small>
            <p
                dangerouslySetInnerHTML={{
                    __html: article.description.childMarkdownRemark.html
                }}
            />
        </div>
    );
};
