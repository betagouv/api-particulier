import {Router} from 'express';
import {fetchDgfipDataControllerBuidler} from 'src/presentation/controllers/fetch-data.controller';
import {pingControllerBuilder} from 'src/presentation/controllers/ping.controller';
import {credentialsValidationMiddleware} from 'src/presentation/middlewares/credentials-validation.middleware';
import {dfdipInputValidationMiddleware} from 'src/presentation/middlewares/dgfip-input-validation.middleware';
import {manageErrorMiddleware} from 'src/presentation/middlewares/error-management.middleware';
import {journalMiddleware} from 'src/presentation/middlewares/journal.middleware';
import {timingMiddleware} from 'src/presentation/middlewares/timing.middleware';

export const dgfipRouter = Router();

dgfipRouter.get(
  '/impots/svair',
  credentialsValidationMiddleware,
  timingMiddleware,
  dfdipInputValidationMiddleware,
  fetchDgfipDataControllerBuidler(false),
  manageErrorMiddleware,
  journalMiddleware
);
dgfipRouter.get(
  '/v2/avis-imposition',
  credentialsValidationMiddleware,
  timingMiddleware,
  dfdipInputValidationMiddleware,
  fetchDgfipDataControllerBuidler(true),
  manageErrorMiddleware,
  journalMiddleware
);

dgfipRouter.get(
  '/impots/ping',
  pingControllerBuilder('/v2/avis-imposition', {
    numeroFiscal: process.env.TEST_TAX_NUMBER,
    referenceAvis: process.env.TEST_TAX_NOTICE_NUMBER,
  }),
  manageErrorMiddleware
);
