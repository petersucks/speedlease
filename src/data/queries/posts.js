import { GraphQLList as List } from 'graphql';
import { GraphQLString as String } from 'graphql';

import PostType from '../types/PostType';

import getPosts from '../../core/getPosts';

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
