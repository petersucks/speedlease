/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLList as List,
} from 'graphql';

import PostType from './PostType';

var CriteriaType = new ObjectType({
  name: 'Criteria',
  fields: {
    site:   { type: StringType },
    type:   { type: StringType },
    hood:   { type: StringType },
    min:    { type: IntType },
    max:    { type: IntType } 
  }
});

const SearchType = new ObjectType({
  name: 'Search',
  fields: {
    id:       { type: new NonNull(ID) },
    criteria: { type: CriteriaType },
    posts:    { type: new List(PostType) }
  },
});

export default SearchType;
