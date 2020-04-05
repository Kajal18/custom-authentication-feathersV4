const sequelizeClient = require('./sequelize-client.js');
const logger = require('./logger');
module.exports = function (app) {
  const oldSetup = app.setup;

  app.set('sequelizeClient', sequelizeClient);

  app.setup = function (...args) {
    const result = oldSetup.apply(this, args);

    // Set up data relationships
    const models = sequelizeClient.models;
    Object.keys(models).forEach(name => {
      if ('associate' in models[name]) {
        models[name].associate(models);
      }
    });

    // Sync to the database
    sequelizeClient.sync().then(() => {
      logger.info('Database Sync successful');
    }, (err) => {
      logger.info('Unable to connect to the database:', err);
      process.exit(1);
    });

    return result;
  };
};
