require('dotenv').config();

module.exports = (on, config) => {
  config.env.ISSUER_URL = process.env.ISSUER_URL;
  config.env.TEST_OIDC_EMAIL = process.env.TEST_OIDC_EMAIL;
  config.env.TEST_OIDC_PASSWORD = process.env.TEST_OIDC_PASSWORD;
  config.env.BASE_URL = process.env.BASE_URL;
  config.env.DATAPASS_API_KEY = process.env.DATAPASS_API_KEY;
  config.env.TEST_POLE_EMPLOI_ID = process.env.TEST_POLE_EMPLOI_ID;

  return config;
};
