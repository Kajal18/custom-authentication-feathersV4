module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    const { params } = context;
    console.log({ context, params });
    if (params.provider && !params.authentication) {
      context.params = {
        ...params,
        authentication: {
          strategy: 'jwt'
        }
      };
      context.params.payload = context.params.payload || {};

      Object.assign(context.params.payload, { userId: context.params.user.id });
    }

    return context;
  };
};