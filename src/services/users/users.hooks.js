const { authenticate } = require('@feathersjs/authentication');
// const { authenticate } = require('@feathersjs/express');
const allowAnonymus = require('../../hooks/allowAnonymus');
const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

module.exports = {
  before: {
    all: [],
    find: [
      authenticate('custom')],
    get: [authenticate('custom')],
    create: [hashPassword('password')],
    update: [hashPassword('password'), authenticate('custom')],
    patch: [hashPassword('password'), authenticate('custom')],
    remove: [authenticate('custom')]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
