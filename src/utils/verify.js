const {
  AuthenticationService,
} = require('@feathersjs/authentication');
const UserModel = require('../models/users.model');
const errors = require('@feathersjs/errors');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const normalizeStrategy = (_settings = [], ..._strategies) =>
  typeof _settings === 'string'
    ? { strategies: _.flatten([_settings, ..._strategies]) }
    : _settings;
const getService = (settings, app) => {
  const path = settings.service || app.get('authentication');
  const service = app.service(path);

  if (!service) {
    throw new errors.BadRequest(`Could not find authentication service '${path}'`);
  }

  return service;
};

class MyAuthenticationService extends AuthenticationService {
  async parse(req, res, ...strategies) {
    try {
      let user, app;
      app = this.app;
      const settings = normalizeStrategy(...strategies);
      const service = getService(settings, app);
      console.log(service);
      // authorization token authentication
      if (req.headers.authorization !== undefined || req.query.access_token !== undefined || _.get(req, 'params.query.access_token')) {
        if (!req.headers.authorization) {
          req.headers.authorization = req.query.access_token || _.get(req, 'params.query.access_token');
        }
        if (_.get(req, 'params.query.access_token')) {
          delete req.params.query.access_token;
        }
         

        const { authorization: authToken } = req.headers;
        const jwtToken = authToken.replace('Bearer ', '');
        console.log(jwtToken);
        const decoded = jwt.verify(jwtToken, this.app.get('authentication').secret);
        const userResponse = await UserModel.findAll({
          where: { id: decoded.userId },
        });

        if (userResponse.length > 0) {
          user = JSON.parse(JSON.stringify(userResponse[0]));
          console.log(`${user.email} user authenticated`);

        } else {
          console.log('No user found!');
          return Promise.reject(new errors.NotAuthenticated('InvalidCredentials', {
            errors: { message: 'Invalid Credentials!' }
          }), null);

        }
      } else if (req.body.email !== undefined && req.body.password !== undefined && req.body.strategy !== undefined) { // email, password authentication
        const { email, password } = req.body;
        const userResponseData = await UserModel.findAll({
          where: {
            email,
          }
        });
        if (!userResponseData.length) {
          return Promise.reject(new errors.NotAuthenticated('InvalidCredentials', {
            errors: { message: 'Invalid Credentials!' }
          }), null);
        }
        user = JSON.parse(JSON.stringify(userResponseData[0]));
        // this.getTokenOptions(authResult, params){

        // }

        if (user) {
          const isSamePassword = await bcrypt.compare(password, user.password);
          if (isSamePassword) {
            delete user.password;
            console.log(`${user.email} user authenticated`);
            // service.getPayload(authResult, params).then().catch();


          } else {
            return Promise.reject(new errors.BadRequest('InvalidUserNamePassword', {
              errors: { message: 'Invalid username or password' }
            }), null);
          }
        } else {
          return Promise.reject(new errors.NotAuthenticated('InvalidCredentials', {
            errors: { message: 'Invalid Credentials!' }
          }), null);

        }
      } else {
        return Promise.reject(new errors.BadRequest('InvalidInput', { errors: { message: 'Please provide email and password' } }), null);
      }
    } catch (err) {
      console.log('ERR WHILE LOGIN > ', err);
      if (err.name === 'TokenExpiredError') {
        return Promise.reject(new errors.NotAuthenticated('Invalid Token', { errors: { message: 'Your session is expired, Please login again' } }), null);
      }
      console.log('Something went wrong!', { err });
      return Promise.reject(new errors.NotImplemented('InvalidInput', err), null);
    }
  }
}
module.exports = MyAuthenticationService;
