const express = require('express');
import {default as vhost} from 'vhost';
import {logFor} from 'src/domain/logger';
import {apiRouter} from 'src/presentation/routers/api/index.router';
import {portailRouter} from 'src/presentation/routers/portail/index.router';
import {
  initSentry,
  sentryMiddleware,
} from 'src/presentation/middlewares/sentry.middleware';
import {initWebapp} from 'src/presentation/routers/portail/login.router';
import {forestAdminRouter} from 'src/presentation/routers/forest-admin/index.router';

const app = express();
const logger = logFor('Server');

initSentry(app);
initWebapp(app);

app.use(sentryMiddleware);
app.use('/api', apiRouter);
app.use('/forest', forestAdminRouter);
app.use(
  '/',
  // eslint-disable-next-line node/no-unsupported-features/node-builtins
  vhost(new URL(process.env.BASE_URL!).hostname, portailRouter)
);

app.listen(process.env.PORT || 3000, () => {
  logger.log(
    'info',
    `App listening on http://localhost:${process.env.PORT || 3000}`
  );
});
