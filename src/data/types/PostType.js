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
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const PostType = new ObjectType({
  name: 'Post',
  fields: {
    date:   { type: new NonNull(StringType) },
    link:   { type: new NonNull(StringType) },
    title:  { type: new NonNull(StringType) },
    locale: { type: StringType },
    price:  { type: StringType },
    site:   { type: new NonNull(StringType) },
    hood:   { type: new NonNull(StringType) },
    type:   { type: new NonNull(StringType) },
    pic:    { type: new NonNull(StringType) },
  },
});

export default PostType;
