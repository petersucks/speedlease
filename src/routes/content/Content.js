import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import s from './Content.css';

function Content({ path, title, content }) {
  return (
    <Layout>
      <section className="section">
        <div className="container">
          {title && path !== '/' && <h1 className="title is-1">{title}</h1>}
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </section>
    </Layout>
  );
}

Content.propTypes = {
  path: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  title: PropTypes.string,
};

export default withStyles(s)(Content);
