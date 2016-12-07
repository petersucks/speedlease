import _ from 'lodash';
import { GraphQLList as List } from 'graphql';
import { GraphQLString as String } from 'graphql';
import { GraphQLBoolean as Boolean } from 'graphql';

import SearchType from '../types/SearchType';

import Search from '../models/Search';

function parseCriteria(res) {
  res.dataValues.criteria = JSON.parse(res.dataValues.criteria);
  return res.dataValues;
}

function updateExistingSearch({ id, update, ...criteria }) { 
  return Search.update({ criteria: JSON.stringify(criteria) }, { where: { id: id } })
    .then(updated => { 
      if (updated[0] > 0) { // updated row successfully
        return { id, criteria } 
      }
    });
}

function findExistingSearch({ id }) {
  return Search.findOne({ where: { id: id } }).then(search => {
    if (search) {
      return parseCriteria(search);
    }
  });
}

function handleSearch(params) {
  return new Promise((resolve, reject) => {
    if (params.id && params.update) {
      updateExistingSearch(params).then(search => resolve(search));
    } 
    else if (params.id) {
      findExistingSearch(params).then(search => resolve(search));
    }
  });
}

const search = {
  type: SearchType,
  args: {
    id:     { type: String },
    update: { type: String },
    // criteria params
    site:   { type: String },
    type:   { type: String },
    hood:   { type: String },
    min:    { type: String },
    max:    { type: String }
  },
  async resolve(parent, params) {
    let data = await handleSearch(params);
    return data;
  },
};

export default search;
