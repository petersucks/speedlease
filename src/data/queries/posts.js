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
import PostType from '../types/PostType';

import getPosts from '../../core/redis';

const posts = {
  type: new List(PostType),
  args: { 
    site: { type: String },
    type: { type: String },
    hood: { type: String },
    min:  { type: String },
    max:  { type: String }
  },
  async resolve(parent, args) {
    let data = await getPosts({...args});
    return data;
  },
};

export default posts;
