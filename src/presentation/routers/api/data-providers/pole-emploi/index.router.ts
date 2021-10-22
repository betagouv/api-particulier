import {Router} from 'express';
import {fetchPoleEmploiDataControllerBuidler} from 'src/presentation/controllers/fetch-data.controller';
import {credentialsValidationMiddleware} from 'src/presentation/middlewares/credentials-validation.middleware';
import {manageErrorMiddleware} from 'src/presentation/middlewares/error-management.middleware';
import {journalMiddleware} from 'src/presentation/middlewares/journal.middleware';
import {timingMiddleware} from 'src/presentation/middlewares/timing.middleware';
import {poleEmploiInputValidationMiddleware} from 'src/presentation/middlewares/pole-emploi-input-validation.middleware';

export const poleEmploiRouter = Router();

poleEmploiRouter.get(
  '/v2/situations-pole-emploi',
  credentialsValidationMiddleware,
  timingMiddleware,
  poleEmploiInputValidationMiddleware,
  fetchPoleEmploiDataControllerBuidler(),
  manageErrorMiddleware,
  journalMiddleware
);
