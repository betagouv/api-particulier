import {Router} from 'express';
import {fetchCnafDataControllerBuidler} from 'src/presentation/controllers/fetch-data.controller';
import {credentialsValidationMiddleware} from 'src/presentation/middlewares/credentials-validation.middleware';
import {cnafInputValidationMiddleware} from 'src/presentation/middlewares/cnaf-input-validation.middleware';
import {manageErrorMiddleware} from 'src/presentation/middlewares/error-management.middleware';
import {journalMiddleware} from 'src/presentation/middlewares/journal.middleware';
import {timingMiddleware} from 'src/presentation/middlewares/timing.middleware';
import {pingControllerBuilder} from 'src/presentation/controllers/ping.controller';

export const cnafRouter = Router();

cnafRouter.get(
  '/caf/famille',
  credentialsValidationMiddleware,
  timingMiddleware,
  cnafInputValidationMiddleware,
  fetchCnafDataControllerBuidler(),
  manageErrorMiddleware,
  journalMiddleware
);
cnafRouter.get(
  '/v2/composition-familiale',
  credentialsValidationMiddleware,
  timingMiddleware,
  cnafInputValidationMiddleware,
  fetchCnafDataControllerBuidler(),
  manageErrorMiddleware,
  journalMiddleware
);

cnafRouter.get(
  '/caf/ping',
  pingControllerBuilder('/v2/composition-familiale', {
    codePostal: process.env.TEST_CODE_POSTAL,
    numeroAllocataire: process.env.TEST_NUMERO_ALLOCATAIRE,
  }),
  manageErrorMiddleware
);
