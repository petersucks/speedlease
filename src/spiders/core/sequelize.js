const Sequelize   = require('sequelize'),
      databaseUrl = 'sqlite:database.sqlite'; // or something

const sequelize = new Sequelize(databaseUrl, {
  define: {
    freezeTableName: true,
  },
});

const Search = sequelize.define('Search', {

  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
  },

  email: {
    type: Sequelize.STRING(255),
    validate: { isEmail: true },
  },

  criteria: {
    type: Sequelize.STRING(255)
  }

}, {

  indexes: [
    { fields: ['email'] },
  ],

});

module.exports = Search;