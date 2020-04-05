// Application hooks that run for every service

module.exports = {
  before: {
    all: [
      context => {
        if (context.params && context.params.authentication) {
          context.params.authentication.strategy = 'custom';
        }
      }
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
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
