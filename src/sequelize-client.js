const Sequelize = require('sequelize');
const CONSTANTS = require('./constants.js');
const POSTGRES = CONSTANTS.POSTGRES;

// const operatorsAliases = require('./sequelize-operators-aliases');
const sequelizeClient = new Sequelize({
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'test',
  dialect: 'postgres',
  port: 5432,
  logging: false,
  // operatorsAliases,
  define: {
    freezeTableName: true
  },
  pool: {
    max: 2,
    min: 0,
    acquire: 50000,
    idle: 10000
  },
});
// console.log('Connected database', POSTGRES.DB);

module.exports = sequelizeClient;
