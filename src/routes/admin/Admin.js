import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Layout from '../../components/Layout';
import s from './Admin.css';

function Admin({ title }) {
  return (
    <Layout>
      <div className={s.root}>
        <div className={s.container}>
          <h1>{title}</h1>
          <p>...</p>
        </div>
      </div>
    </Layout>
  );
}

Admin.propTypes = {
  title: PropTypes.string.isRequired,
};

export default withStyles(s)(Admin);
