const express = require('express');
import {default as vhost} from 'vhost';
import {logFor} from 'src/domain/logger';
import {apiRouter} from 'src/presentation/routers/api.router';
import {portailRouter} from 'src/presentation/routers/portail.router';
import {initSentry, sentryRouter} from 'src/presentation/routers/sentry.router';
import {initWebapp} from 'src/presentation/routers/webapp.router';

const app = express();
const logger = logFor('Server');

initSentry(app);
initWebapp(app);

app.use(sentryRouter);
app.use('/api', apiRouter);
app.use(
  '/',
  // eslint-disable-next-line node/no-unsupported-features/node-builtins
  vhost(new URL(process.env.BASE_URL!).hostname, portailRouter)
);

app.listen(process.env.PORT || 3000, () => {
  logger.log('info', `App listening on port ${process.env.PORT || 3000}`);
});
