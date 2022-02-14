import {Router} from 'express';
import {credentialsValidationMiddleware} from 'src/presentation/middlewares/credentials-validation.middleware';
import {manageErrorMiddleware} from 'src/presentation/middlewares/error-management.middleware';
import {journalMiddleware} from 'src/presentation/middlewares/journal.middleware';
import {timingMiddleware} from 'src/presentation/middlewares/timing.middleware';
import {fetchCnafDataControllerBuidler} from 'src/presentation/controllers/fetch-data.controller';
import {cnousInputValidationMiddleware} from 'src/presentation/middlewares/cnous-input-validation.middleware';

export const cnousRouter = Router();

cnousRouter.get(
  '/v2/etudiants-boursiers',
  credentialsValidationMiddleware,
  timingMiddleware,
  cnousInputValidationMiddleware,
  fetchCnafDataControllerBuidler(),
  manageErrorMiddleware,
  journalMiddleware
);
