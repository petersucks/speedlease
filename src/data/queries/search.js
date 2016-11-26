/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLList as List } from 'graphql';
import { GraphQLString as String } from 'graphql';
import { GraphQLBoolean as Boolean } from 'graphql';

import SearchType from '../types/SearchType';
import Search from '../models/Search';

import random from 'randomstring';

const KEYLENGTH = 32;

function parseCriteria(res) {
  //
  // parses stringified criteria object
  //

  res.dataValues.criteria = JSON.parse(res.dataValues.criteria);
  return res.dataValues;
}

function handleSearch(c) {
  //
  // retrieves, updates, or creates a search
  //

  const { id, secret, update, site, type, hood, min, max } = c;

  return new Promise((resolve, reject) => {

    // retrieve existing search
    if (id && !update) {
      console.log('existing')
      return Search.findOne({ where: { id: id } })
             .then(res => res ? resolve(parseCriteria(res)) : reject('Search not found'));
    
    // update existing search
    } else if (update) {

      // lazily return this
      let updatedSearch = {
        id: id,
        criteria: {
          site: site,
          type: type,
          hood: hood,
          min:  min,
          max:  max
        }
      };
      console.log('updating')
      
      return Search.update({
        criteria: JSON.stringify(updatedSearch.criteria)
        }, { where: { id: id } })
        .then(res => res ? resolve(updatedSearch) : reject('Error updating search'));

    // save new search
    } else if (secret && secret === 'pass') {
      let newID = random.generate(KEYLENGTH);

      console.log('new')

      return Search.findOne({ where: { id: newID } })
             .then(res => {
               
               if (!res) { // if ID nonexistent

                 // TODO: SANITIZE CRITERIA INPUT......
                  
                 Search.create({
                   id: newID,
                   email: 'default@email.com',
                   criteria: JSON.stringify({
                     site: site,
                     type: type,
                     hood: hood,
                     min:  min,
                     max:  max
                   })
                 }).then(res => resolve(parseCriteria(res)));
               }
             });
    }

  });
}

const search = {
  type: SearchType,
  args: { 
    id:     { type: String },
    secret: { type: String },
    update: { type: String },

    // criteria arguments
    site:   { type: String },
    type:   { type: String },
    hood:   { type: String },
    min:    { type: String },
    max:    { type: String }
  },
  async resolve(parent, args) {
    let data = await handleSearch(args);
    return data;
  },
};

export default search;
