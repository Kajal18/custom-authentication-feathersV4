// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const sequelizeClient = require('../sequelize-client');

const users = sequelizeClient.define('users', {

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }


}, {
  hooks: {
    beforeCount(options) {
      options.raw = true;
    }
  }
});

// eslint-disable-next-line no-unused-vars
users.associate = function (models) {
  // Define associations here
  // See http://docs.sequelizejs.com/en/latest/docs/associations/
};

module.exports = users;
