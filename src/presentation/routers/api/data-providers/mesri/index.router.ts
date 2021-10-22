import {Router} from 'express';
import {fetchMesriDataControllerBuidler} from 'src/presentation/controllers/fetch-data.controller';
import {credentialsValidationMiddleware} from 'src/presentation/middlewares/credentials-validation.middleware';
import {manageErrorMiddleware} from 'src/presentation/middlewares/error-management.middleware';
import {journalMiddleware} from 'src/presentation/middlewares/journal.middleware';
import {timingMiddleware} from 'src/presentation/middlewares/timing.middleware';
import {mesriInputValidationMiddleware} from 'src/presentation/middlewares/mesri-input-validation.middleware';

export const mesriRouter = Router();

mesriRouter.get(
  '/v2/etudiants',
  credentialsValidationMiddleware,
  timingMiddleware,
  mesriInputValidationMiddleware,
  fetchMesriDataControllerBuidler(),
  manageErrorMiddleware,
  journalMiddleware
);
