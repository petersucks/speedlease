import _ from 'lodash';
import React from 'react';

import Search from './Search';
import fetch from '../../core/fetch';

import { buildQuery, graphQL } from '../../core/query';

export default {

  path: '/search',
  children: [

    {
      // without search ID
      path: '/',

      async action() { // eslint-disable-line react/prop-types
        return {
          title: 'Search',
          component: <Search />,
        };
      },
    },

    {
      // with search ID
      path: '/:id',

      async action({ params: { id }}) {
        const query = `{search(id:"${id}"){criteria{site,type,hood,min,max}}}`;
        const {data: {search}} = await graphQL(query);
        
        if (!search) {
          return {
            redirect: '/search' }; }

        else {
          return {
            title: 'Search',
            component: <Search id={id} search={search}/> }; }

      }
    }
  ]

};
