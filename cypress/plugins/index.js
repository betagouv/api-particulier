require('dotenv').config();

module.exports = (on, config) => {
  config.env.ISSUER_URL = process.env.ISSUER_URL;
  config.env.TEST_OIDC_EMAIL = process.env.TEST_OIDC_EMAIL;
  config.env.TEST_OIDC_PASSWORD = process.env.TEST_OIDC_PASSWORD;
  config.env.BASE_URL = process.env.BASE_URL;

  return config;
};
