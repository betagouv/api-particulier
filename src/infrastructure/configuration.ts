import {NodeOptions} from '@sentry/node';
import IORedis = require('ioredis');
import {Pool} from 'pg';

export const postgresPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
export const redisConnection = new IORedis(process.env.REDIS_URL);
export const sentryOptions: NodeOptions = {
  dsn: process.env.SENTRY_DSN,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  environment: process.env.ENV,
  maxValueLength: 2000,
  enabled: process.env.SENTRY_ENABLED === 'true',
};
