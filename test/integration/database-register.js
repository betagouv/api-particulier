const {pgPool} = require('./config');
// eslint-disable-next-line node/no-unpublished-require
const {default: pgMigrate} = require('node-pg-migrate');
const {redisConnection} = require('./config');

exports.mochaGlobalSetup = async function () {
  await pgPool.query(`
    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS pgmigrations;
    DROP TABLE IF EXISTS tokens;
    DROP TABLE IF EXISTS applications;
    DROP MATERIALIZED VIEW IF EXISTS consumptions_summary_daily;
    DROP MATERIALIZED VIEW IF EXISTS consumptions_summary_hourly;
    DROP TABLE IF EXISTS journal_entries;
      `);
  await pgMigrate({
    migrationsTable: 'pgmigrations',
    count: 1000,
    dir: process.cwd() + '/migrations',
    direction: 'up',
    databaseUrl: process.env.TEST_DATABASE_URL,
  });
};

exports.mochaGlobalTeardown = async function () {
  await pgPool.end();
  await redisConnection.disconnect(false);
};
