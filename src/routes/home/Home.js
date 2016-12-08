import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import s from './Home.css';

function Home() {
  return (
    <Layout>
      <div className={s.root}>
        <div className={s.container}>
          <h1 className={s.title}>SpeedLease</h1>
        </div>
      </div>
    </Layout>
  );
}

export default withStyles(s)(Home);
