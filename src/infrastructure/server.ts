const express = require('express');
import {logFor} from 'src/domain/logger';
import {apiRouter} from 'src/presentation/routers/api.router';
import {queueAdminRouter} from 'src/presentation/routers/queue-admin.router';
import {initSentry, sentryRouter} from 'src/presentation/routers/sentry.router';

const app = express();
const logger = logFor('Server');

initSentry(app);

app.use(sentryRouter);
app.use('/admin/queues', queueAdminRouter);
app.use('/api', apiRouter);

app.listen(process.env.PORT || 3000, () => {
  logger.log('info', `App listening on port ${process.env.PORT || 3000}`);
});
