import {Pool} from 'pg';

export const postgresPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
