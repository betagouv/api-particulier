const {Pool} = require('pg');

module.exports = {
  pgPool: new Pool({
    connectionString: process.env.TEST_DATABASE_URL,
  }),
};
