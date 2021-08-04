const express = require('express');
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import * as basicAuth from 'express-basic-auth';
import {logFor} from 'src/domain/logger';
import {sentryOptions} from 'src/infrastructure/configuration/sentry';
import {
  fetchCnafDataControllerBuidler,
  fetchDgfipDataControllerBuidler,
} from 'src/presentation/controllers/fetch-data.controller';
import {cnafInputValidationMiddleware} from 'src/presentation/middlewares/cnaf-input-validation.middleware';
import {dfdipInputValidationMiddleware} from 'src/presentation/middlewares/dgfip-input-validation.middleware';
import {discrepancyCheckerMiddleware} from 'src/presentation/middlewares/discrepancy-spotter.middleware';
import {manageErrorMiddleware} from 'src/presentation/middlewares/error-management.middleware';
import {journalMiddleware} from 'src/presentation/middlewares/journal.middleware';
import {timingMiddleware} from 'src/presentation/middlewares/timing.middleware';
import {ExpressAdapter} from '@bull-board/express';
import {createBullBoard} from '@bull-board/api';
import {BullMQAdapter} from '@bull-board/api/bullMQAdapter';
import {Queue} from 'bullmq';
import {
  applicationEventQueueName,
  tokenEventQueueName,
} from 'src/infrastructure/event-bus/bull.event-bus';

const app = express();
const logger = logFor('Server');
const serverAdapter = new ExpressAdapter();

createBullBoard({
  queues: [
    new BullMQAdapter(new Queue(applicationEventQueueName)),
    new BullMQAdapter(new Queue(tokenEventQueueName)),
  ],
  serverAdapter,
});
serverAdapter.setBasePath('/admin/queues');

Sentry.init({
  ...sentryOptions,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({tracing: true}),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({app}),
  ],
});

app.use(
  '/admin/queues',
  basicAuth({
    users: {
      [process.env.ADMIN_USER || 'admin']:
        process.env.ADMIN_PASSWORD || 'password',
    },
    realm: process.env.ENV,
    challenge: true,
  }),
  serverAdapter.getRouter()
);
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.get(
  '/api/impots/svair',
  timingMiddleware,
  discrepancyCheckerMiddleware,
  dfdipInputValidationMiddleware,
  fetchDgfipDataControllerBuidler(false),
  manageErrorMiddleware,
  journalMiddleware
);
app.get(
  '/api/v2/avis-imposition',
  timingMiddleware,
  discrepancyCheckerMiddleware,
  dfdipInputValidationMiddleware,
  fetchDgfipDataControllerBuidler(true),
  manageErrorMiddleware,
  journalMiddleware
);

app.get(
  '/api/caf/famille',
  timingMiddleware,
  discrepancyCheckerMiddleware,
  cnafInputValidationMiddleware,
  fetchCnafDataControllerBuidler(),
  manageErrorMiddleware,
  journalMiddleware
);
app.get(
  '/api/v2/composition-familiale',
  timingMiddleware,
  discrepancyCheckerMiddleware,
  cnafInputValidationMiddleware,
  fetchCnafDataControllerBuidler(),
  manageErrorMiddleware,
  journalMiddleware
);

app.listen(process.env.PORT || 3000, () => {
  logger.log('info', `App listening on port ${process.env.PORT || 3000}`);
});
