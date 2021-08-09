import {Router, Request, Response} from 'express';
import {json} from 'body-parser';
import {createApplicationController} from 'src/presentation/controllers/create-application.controller';
import {
  fetchCnafDataControllerBuidler,
  fetchDgfipDataControllerBuidler,
  fetchPoleEmploiDataControllerBuidler,
} from 'src/presentation/controllers/fetch-data.controller';
import {introspectController} from 'src/presentation/controllers/introspect.controller';
import {pingControllerBuilder} from 'src/presentation/controllers/ping.controller';
import {apiKeyValidationMiddleware} from 'src/presentation/middlewares/api-key-validation.middleware';
import {cnafInputValidationMiddleware} from 'src/presentation/middlewares/cnaf-input-validation.middleware';
import {createApplicationValidationMiddleware} from 'src/presentation/middlewares/create-application-validation.middleware';
import {dfdipInputValidationMiddleware} from 'src/presentation/middlewares/dgfip-input-validation.middleware';
import {discrepancyCheckerMiddleware} from 'src/presentation/middlewares/discrepancy-spotter.middleware';
import {manageErrorMiddleware} from 'src/presentation/middlewares/error-management.middleware';
import {journalMiddleware} from 'src/presentation/middlewares/journal.middleware';
import {timingMiddleware} from 'src/presentation/middlewares/timing.middleware';
import {poleEmploiInputValidationMiddleware} from 'src/presentation/middlewares/pole-emploi-input-validation.middleware';

export const apiRouter = Router();

apiRouter.get(
  '/impots/svair',
  apiKeyValidationMiddleware,
  timingMiddleware,
  discrepancyCheckerMiddleware,
  dfdipInputValidationMiddleware,
  fetchDgfipDataControllerBuidler(false),
  manageErrorMiddleware,
  journalMiddleware
);
apiRouter.get(
  '/v2/avis-imposition',
  apiKeyValidationMiddleware,
  timingMiddleware,
  discrepancyCheckerMiddleware,
  dfdipInputValidationMiddleware,
  fetchDgfipDataControllerBuidler(true),
  manageErrorMiddleware,
  journalMiddleware
);

apiRouter.get(
  '/caf/famille',
  apiKeyValidationMiddleware,
  timingMiddleware,
  discrepancyCheckerMiddleware,
  cnafInputValidationMiddleware,
  fetchCnafDataControllerBuidler(),
  manageErrorMiddleware,
  journalMiddleware
);
apiRouter.get(
  '/v2/composition-familiale',
  apiKeyValidationMiddleware,
  timingMiddleware,
  discrepancyCheckerMiddleware,
  cnafInputValidationMiddleware,
  fetchCnafDataControllerBuidler(),
  manageErrorMiddleware,
  journalMiddleware
);

apiRouter.get(
  '/v2/situations-pole-emploi',
  apiKeyValidationMiddleware,
  timingMiddleware,
  discrepancyCheckerMiddleware,
  poleEmploiInputValidationMiddleware,
  fetchPoleEmploiDataControllerBuidler(),
  manageErrorMiddleware,
  journalMiddleware
);

apiRouter.get(
  '/introspect',
  apiKeyValidationMiddleware,
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
  apiKeyValidationMiddleware,
  createApplicationValidationMiddleware,
  createApplicationController,
  manageErrorMiddleware
);
