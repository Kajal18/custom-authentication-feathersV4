
const changeStrategy = () => {
  return async context => {
    if (context.path === 'users' && context.method === 'create') {
      return Promise.resolve(context);
    }
    else {
      if (context.params && context.params.authentication) {
        if (context.params.authentication.strategy === 'jwt' || context.params.authentication.strategy === 'local') {
          context.params.authentication.strategy = 'custom';
          return Promise.resolve(context);
        } else {
          return Promise.resolve(context);
        }
      }
      return Promise.resolve(context);
    }
  };
};

module.exports = changeStrategy;
