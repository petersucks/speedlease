import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import s from './Content.css';

function Content({ path, title, content }) {
  return (
    <Layout>
      <div className={s.root}>
        <div className={s.container}>
          {title && path !== '/' && <h1>{title}</h1>}
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </Layout>
  );
}

Content.propTypes = {
  path: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  title: PropTypes.string,
};

export default withStyles(s)(Content);
