import {Router, Request, Response} from 'express';
import {json} from 'body-parser';
import {default as cors} from 'cors';
import {createApplicationController} from 'src/presentation/controllers/create-application.controller';
import {
  fetchCnafDataControllerBuidler,
  fetchDgfipDataControllerBuidler,
  fetchMesriDataControllerBuidler,
  fetchPoleEmploiDataControllerBuidler,
} from 'src/presentation/controllers/fetch-data.controller';
import {introspectController} from 'src/presentation/controllers/introspect.controller';
import {pingControllerBuilder} from 'src/presentation/controllers/ping.controller';
import {credentialsValidationMiddleware} from 'src/presentation/middlewares/credentials-validation.middleware';
import {cnafInputValidationMiddleware} from 'src/presentation/middlewares/cnaf-input-validation.middleware';
import {createApplicationValidationMiddleware} from 'src/presentation/middlewares/create-application-validation.middleware';
import {dfdipInputValidationMiddleware} from 'src/presentation/middlewares/dgfip-input-validation.middleware';
import {manageErrorMiddleware} from 'src/presentation/middlewares/error-management.middleware';
import {journalMiddleware} from 'src/presentation/middlewares/journal.middleware';
import {timingMiddleware} from 'src/presentation/middlewares/timing.middleware';
import {poleEmploiInputValidationMiddleware} from 'src/presentation/middlewares/pole-emploi-input-validation.middleware';
import {mesriInputValidationMiddleware} from 'src/presentation/middlewares/mesri-input-validation.middleware';
import {schema} from 'src/presentation/schema';

export const apiRouter = Router();

const corsMiddleware = cors({
  methods: 'GET',
  origin: /^https:\/\/api\.gouv\.fr$/,
  optionsSuccessStatus: 200,
});

apiRouter.use(corsMiddleware);

apiRouter.get(
  '/impots/svair',
  credentialsValidationMiddleware,
  timingMiddleware,
  dfdipInputValidationMiddleware,
  fetchDgfipDataControllerBuidler(false),
  manageErrorMiddleware,
  journalMiddleware
);
apiRouter.get(
  '/v2/avis-imposition',
  credentialsValidationMiddleware,
  timingMiddleware,
  dfdipInputValidationMiddleware,
  fetchDgfipDataControllerBuidler(true),
  manageErrorMiddleware,
  journalMiddleware
);

apiRouter.get(
  '/caf/famille',
  credentialsValidationMiddleware,
  timingMiddleware,
  cnafInputValidationMiddleware,
  fetchCnafDataControllerBuidler(),
  manageErrorMiddleware,
  journalMiddleware
);
apiRouter.get(
  '/v2/composition-familiale',
  credentialsValidationMiddleware,
  timingMiddleware,
  cnafInputValidationMiddleware,
  fetchCnafDataControllerBuidler(),
  manageErrorMiddleware,
  journalMiddleware
);

apiRouter.get(
  '/v2/situations-pole-emploi',
  credentialsValidationMiddleware,
  timingMiddleware,
  poleEmploiInputValidationMiddleware,
  fetchPoleEmploiDataControllerBuidler(),
  manageErrorMiddleware,
  journalMiddleware
);

apiRouter.get(
  '/v2/etudiants',
  credentialsValidationMiddleware,
  timingMiddleware,
  mesriInputValidationMiddleware,
  fetchMesriDataControllerBuidler(),
  manageErrorMiddleware,
  journalMiddleware
);

apiRouter.get(
  '/introspect',
  credentialsValidationMiddleware,
  introspectController,
  manageErrorMiddleware
);

apiRouter.get(
  '/impots/ping',
  pingControllerBuilder('/v2/avis-imposition', {
    numeroFiscal: process.env.TEST_TAX_NUMBER,
    referenceAvis: process.env.TEST_TAX_NOTICE_NUMBER,
  }),
  manageErrorMiddleware
);

apiRouter.get(
  '/caf/ping',
  pingControllerBuilder('/v2/composition-familiale', {
    codePostal: process.env.TEST_CODE_POSTAL,
    numeroAllocataire: process.env.TEST_NUMERO_ALLOCATAIRE,
  }),
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
  res.type('text/yaml').send(schema.getSpecAsYaml());
});
