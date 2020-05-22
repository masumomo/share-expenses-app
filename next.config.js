module.exports = {
  webpack: (config, options) => {
    config.module.rules.resolve = {
      alias: {},
    };

    return config;
  },
  env: {
    API_ENDPOINT:
      "https://491qlrloe6.execute-api.us-east-1.amazonaws.com/dev/dev/graphql",
  },
};
