import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Search.css';
import Layout from '../../components/Layout';
import Search from '../../components/Search'

function RootSearch({ search, id }) {
  return (
    <Layout>
      <section className="section">
        <div className="container">
          <h1 className="title is-1">Search</h1>
          <Search search={search} id={id} />
        </div>
        <script src="https://checkout.stripe.com/checkout.js"></script>
      </section>
    </Layout>
  );
}

RootSearch.propTypes = {
  search: PropTypes.object,
};

export default withStyles(s)(RootSearch);
