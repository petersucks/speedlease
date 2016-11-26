/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Search from './Search';
import fetch from '../../core/fetch';
import _ from 'lodash';

export default {

  path: '/search',

  async action({ query }) { // eslint-disable-line react/prop-types

    if (!_.isEmpty(query) && query.q) {
      const resp = await fetch('/graphql', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `{search(id:"${query.q}"){id,criteria{site,type,hood,min,max}}}`,
        }),
        credentials: 'include',
      });

      if (resp.status !== 200) throw new Error(resp.statusText);
      var {data: {search}} = await resp.json();
    }

    return {
      title: 'Search',
      component: <Search search={search || null} />,
    };
  },

};
