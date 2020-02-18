const devConfig = {
  Mongo_URL: 'mongodb://localhost/RestAPI-dev',
  JWT_Secret: 'thisisjwtsecret',
};

const testConfig = {
  Mongo_URL: 'mongodb://localhost/RestAPI-test',
};

const prodConfig = {
  Mongo_URL: 'mongodb://localhost/RestAPI-prod',
};

const defaultConfig = {
  PORT: process.env.PORT || 3100,
};

function envConfig(env) {
  switch (env) {
    case 'development':
      return devConfig;
    case 'test':
      return testConfig;
    default:
      return prodConfig;
  }
}

export default {
  ...defaultConfig,
  ...envConfig(process.env.NODE_ENV),
};
