import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import {Router, Express} from 'express';
import {sentryOptions} from 'src/infrastructure/configuration/sentry';

export const initSentry = (app: Express) => {
  Sentry.init({
    ...sentryOptions,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({tracing: true}),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({app}),
    ],
  });
};

export const sentryMiddleware = Router();

sentryMiddleware.use(Sentry.Handlers.requestHandler());
sentryMiddleware.use(Sentry.Handlers.tracingHandler());
