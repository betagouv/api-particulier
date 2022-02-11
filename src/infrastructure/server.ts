import {default as vhost} from 'vhost';
import {logFor} from 'src/domain/logger';
import {apiRouter} from 'src/presentation/routers/api/index.router';
import {
  initSentry,
  sentryMiddleware,
} from 'src/presentation/middlewares/sentry.middleware';
import {forestAdminRouter} from 'src/presentation/routers/forest-admin/index.router';
import {
  initPortail,
  portailRouter,
} from 'src/presentation/routers/portail.router';
import express, {Request, Response} from 'express';

const app = express();
const logger = logFor('Server');

initPortail(app);
initSentry(app);

app.use(sentryMiddleware);
app.use('/api', apiRouter);
app.use('/forest', forestAdminRouter);
app.use(
  '/',
  // eslint-disable-next-line node/no-unsupported-features/node-builtins
  vhost(new URL(process.env.BASE_URL!).hostname, portailRouter)
);
app.get('/', (_req: Request, res: Response) => {
  res.redirect('https://api.gouv.fr/les-api/api-particulier');
});

app.listen(process.env.PORT || 3000, () => {
  logger.log(
    'info',
    `App listening on http://localhost:${process.env.PORT || 3000}`
  );
});
