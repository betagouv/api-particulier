const {Pool} = require('pg');
const IORedis = require('ioredis');

module.exports = {
  pgPool: new Pool({
    connectionString: process.env.TEST_DATABASE_URL,
  }),
  redisConnection: new IORedis(process.env.REDIS_URL),
};
