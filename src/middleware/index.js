// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  // Add your custom middleware here. Remember that
  // in Express, the order matters.
  app.use(async (req, res, next) => {

    if (req.authentication && req.authentication.strategy) {
      if (req.authentication.strategy && (req.authentication.strategy === 'jwt' || req.authentication.strategy === 'local')) {
        req.authentication.strategy = 'custom';
        next();
      } else {
        next();
      }
    } else {
      next();
    }
  });

};
