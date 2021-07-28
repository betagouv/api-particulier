const express = require('express');
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import {logFor} from 'src/domain/logger';
import {fetchDgfipDataControllerBuidler} from 'src/presentation/controllers/fetch-data.controller';
import {dfdipInputValidationMiddleware} from 'src/presentation/middlewares/dgfip-input-validation.middleware';
import {discrepancyCheckerMiddleware} from 'src/presentation/middlewares/discrepancy-spotter.middleware';
import {manageErrorMiddleware} from 'src/presentation/middlewares/error-management.middleware';

const app = express();
const logger = logFor('Server');
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({tracing: true}),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({app}),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  environment: process.env.ENV,
  maxValueLength: 2000,
  enabled: process.env.SENTRY_ENABLED === 'true',
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.get(
  '/api/impots/svair',
  discrepancyCheckerMiddleware,
  dfdipInputValidationMiddleware,
  fetchDgfipDataControllerBuidler(false),
  Sentry.Handlers.errorHandler(),
  manageErrorMiddleware
);
app.get(
  '/api/v2/avis-imposition',
  discrepancyCheckerMiddleware,
  dfdipInputValidationMiddleware,
  fetchDgfipDataControllerBuidler(true),
  Sentry.Handlers.errorHandler(),
  manageErrorMiddleware
);

app.listen(process.env.PORT || 3000, () => {
  logger.log('info', `App listening on port ${process.env.PORT || 3000}`);
});
