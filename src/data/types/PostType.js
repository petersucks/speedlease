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
    locale: { type: StringType },
    pics:   { type: StringType },
    price:  { type: StringType },
    title:  { type: new NonNull(StringType) },
    site:   { type: new NonNull(StringType) },
    type:   { type: new NonNull(StringType) },
    hood:   { type: new NonNull(StringType) },
  },
});

export default PostType;
