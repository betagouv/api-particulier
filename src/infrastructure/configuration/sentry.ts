import {NodeOptions} from '@sentry/node';

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
