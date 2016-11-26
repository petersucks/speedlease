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

const redis  = require('redis'),
      client = redis.createClient();

client.on('error', (err) => {
  console.log(err);
});

function getPosts({ site, type, hood }) {
  return new Promise((resolve, reject) => {

    // form query string
    let query = ['posts', site, type, hood].join(':');

    // query redis for posts
    client.lrange(query, 0, -1, (err, res) => {
      if (err) return reject(err);

      let data = res.map(post => JSON.parse(post));
      resolve(data);
    });
  });
}

const posts = {
  type: new List(PostType),
  args: { 
    site: { type: String },
    type: { type: String },
    hood: { type: String }
  },
  async resolve(parent, args) {
    let data = await getPosts({...args});
    return data;
  },
};

export default posts;
