import {Router, Request, Response} from 'express';
import {json} from 'body-parser';
import {default as cors} from 'cors';
import {createApplicationController} from 'src/presentation/controllers/create-application.controller';
import {introspectController} from 'src/presentation/controllers/introspect.controller';
import {credentialsValidationMiddleware} from 'src/presentation/middlewares/credentials-validation.middleware';
import {createApplicationValidationMiddleware} from 'src/presentation/middlewares/create-application-validation.middleware';
import {manageErrorMiddleware} from 'src/presentation/middlewares/error-management.middleware';
import {
  schemaWithApiKey,
  schemaWithFranceConnectToken,
} from 'src/presentation/schema';
import {mesriRouter} from 'src/presentation/routers/api/data-providers/mesri/index.router';
import {cnafRouter} from 'src/presentation/routers/api/data-providers/cnaf/index.router';
import {dgfipRouter} from 'src/presentation/routers/api/data-providers/dgfip/index.router';
import {poleEmploiRouter} from 'src/presentation/routers/api/data-providers/pole-emploi/index.router';

export const apiRouter = Router();

const corsMiddleware = cors({
  methods: 'GET',
  origin: /^https:\/\/api\.gouv\.fr$/,
  optionsSuccessStatus: 200,
});

apiRouter.use(corsMiddleware);

apiRouter.use(cnafRouter);
apiRouter.use(dgfipRouter);
apiRouter.use(mesriRouter);
apiRouter.use(poleEmploiRouter);

apiRouter.get('/', (_req: Request, res: Response) => {
  res.redirect(process.env.DOCUMENTATION_URL!);
});

apiRouter.get(
  '/introspect',
  credentialsValidationMiddleware,
  introspectController,
  manageErrorMiddleware
);

apiRouter.get('/ping', (_req: Request, res: Response) => {
  res.json('pong');
});

apiRouter.post(
  '/applications',
  json(),
  credentialsValidationMiddleware,
  createApplicationValidationMiddleware,
  createApplicationController,
  manageErrorMiddleware
);

apiRouter.get('/open-api.yml', (_req: Request, res: Response) => {
  res.type('text/yaml').send(schemaWithApiKey.getSpecAsYaml());
});

apiRouter.get(
  '/france-connect/open-api.yml',
  (_req: Request, res: Response) => {
    res.type('text/yaml').send(schemaWithFranceConnectToken.getSpecAsYaml());
  }
);
