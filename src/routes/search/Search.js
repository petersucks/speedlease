/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import s from './Search.css';
import Search from '../../components/Search'

function RootSearch({ search, id }) {
  return (
    <Layout>
      <div className="container">
        <h1 className="title is-1">Search</h1>
        <Search search={search} id={id} />
      </div>
    </Layout>
  );
}

RootSearch.propTypes = {
  search: PropTypes.object,
};

export default withStyles(s)(RootSearch);
