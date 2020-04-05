const { JWTStrategy, AuthenticationService } = require('@feathersjs/authentication');
const UserModel = require('../models/users.model');
const errors = require('@feathersjs/errors');
const bcrypt = require('bcryptjs');

class Custom extends JWTStrategy {
  async authenticate(authentication, params) {
    const { accessToken } = authentication;
    if (!accessToken && authentication) {
      let user;
      const { email, password } = authentication;
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
      if (user) {
        const isSamePassword = await bcrypt.compare(password, user.password);
        if (isSamePassword) {
          delete user.password;
          if (user.is_disabled) {
            return Promise.reject(new errors.MethodNotAllowed('AccountDisabled', {
              errors: { message: 'Account has been disabled. Please contact admin!' }
            }), null);
          }
          const token = await this.authentication.createAccessToken({
            userId: user.id
          });
          console.log(`${user.email} user authenticated`);

          return { accessToken: token };
        } else {
          return Promise.reject(new errors.BadRequest('InvalidUserNamePassword', {
            errors: { message: 'Invalid username or password' }
          }), null);
        }
      }
    }
    if (accessToken) {
      let user;
      // params.authentication.strategy = 'preview';
      const payload = await this.authentication.verifyAccessToken(accessToken, params.jwt);
      if (!payload.userId) {
        console.log('Invalid token');
      }
      const userResponse = await UserModel.findAll({
        where: { id: payload.userId }
      });
      if (userResponse.length > 0) {
        user = JSON.parse(JSON.stringify(userResponse[0]));
        if (user.is_disabled) {
          return Promise.reject(new errors.MethodNotAllowed('AccountDisabled', {
            errors: { message: 'Account has been disabled. Please contact admin!' }
          }), null);
        }
        console.log(`${user.email} user authenticated`);
        return { user };
      } else {
        console.log('No user found!');
        return Promise.reject(new errors.NotAuthenticated('InvalidCredentials', {
          errors: { message: 'Invalid Credentials!' }
        }), null);
      }
    }
  }
  // async parse(req) {
  //   return req;
  // }

}

module.exports = Custom;
