import DataType from 'sequelize';
import Model from '../sequelize';

const Search = Model.define('Search', {

  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  email: {
    type: DataType.STRING(255),
    validate: { isEmail: true },
  },

  criteria: {
    type: DataType.STRING(255)
  }

}, {

  indexes: [
    { fields: ['email'] },
  ],

});

export default Search;
