import pgMigrate from 'node-pg-migrate';
// eslint-disable-next-line node/no-unpublished-import
import {run} from 'jest';
import {pgClient} from 'test/integration/config';

const setup = async () => {
  await pgClient.connect();
  await pgClient.query(`
    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS pgmigrations;
    DROP TABLE IF EXISTS tokens;
      `);
  await pgMigrate({
    migrationsTable: 'pgmigrations',
    count: 1000,
    dir: process.cwd() + '/migrations',
    direction: 'up',
    databaseUrl: process.env.TEST_DATABASE_URL!,
  });
};

const teardown = async () => {
  pgClient.end();
};

setup()
  .then(async () => {
    await run(['-c', 'test/integration/jest-integration.json']);
  })
  .then(teardown)
  .catch(e => console.error(e));
