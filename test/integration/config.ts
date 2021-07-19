import {Pool} from 'pg';

export const pgPool = new Pool({
  connectionString: process.env.TEST_DATABASE_URL,
});
