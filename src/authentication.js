const { JWTStrategy, AuthenticationService } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth } = require('@feathersjs/authentication-oauth');


const Custom = require('./utils/verifierClass');

module.exports = (app) => {
  const config = app.get('authentication');
  const authentication = new AuthenticationService(app, 'authentication', config);
  authentication.register('jwt', new JWTStrategy(authentication));
  authentication.register('local', new LocalStrategy(authentication));
  authentication.register('custom', new Custom(authentication));
  app.use('/authentication', authentication);
  app.configure(expressOauth());

};