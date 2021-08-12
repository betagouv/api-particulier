const express = require('express');
import vhost from 'vhost';
import {logFor} from 'src/domain/logger';
import {apiRouter} from 'src/presentation/routers/api.router';
import {
  initPortail,
  portailRouter,
} from 'src/presentation/routers/portail.router';
import {queueAdminRouter} from 'src/presentation/routers/queue-admin.router';
import {initSentry, sentryRouter} from 'src/presentation/routers/sentry.router';

const app = express();
const logger = logFor('Server');

initSentry(app);
initPortail(app);

app.use(sentryRouter);
app.use('/admin/queues', queueAdminRouter);
app.use('/api', apiRouter);
// eslint-disable-next-line node/no-unsupported-features/node-builtins
app.use('/', vhost(new URL(process.env.BASE_URL!).hostname, portailRouter));

app.listen(process.env.PORT || 3000, () => {
  logger.log('info', `App listening on port ${process.env.PORT || 3000}`);
});
