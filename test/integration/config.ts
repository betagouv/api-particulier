import {Client} from 'pg';

export const pgClient = new Client(process.env.TEST_DATABASE_URL);
