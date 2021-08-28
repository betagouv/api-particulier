import {urlencoded} from 'body-parser';
import {Router} from 'express';
import {createPortailApplicationController} from 'src/presentation/controllers/create-portail-application.controller';
import {listUserApplications} from 'src/presentation/controllers/list-user-applications.controller';
import {createUserApplicationValidationMiddleware} from 'src/presentation/middlewares/create-user-application-validation.middleware';
import {isLoggedInMiddleware} from 'src/presentation/middlewares/is-logged-in.middleware';
import {portailErrorMiddleware} from 'src/presentation/middlewares/portail-error.middleware';
import {adminRouter} from 'src/presentation/routers/admin.router';
import {webappRouter} from 'src/presentation/routers/webapp.router';

export const portailRouter = Router();

portailRouter.use(webappRouter);
portailRouter.use(isLoggedInMiddleware);
portailRouter.get('/', listUserApplications);
portailRouter.post(
  '/new',
  urlencoded({extended: true}),
  createUserApplicationValidationMiddleware,
  createPortailApplicationController,
  portailErrorMiddleware
);
portailRouter.use('/admin', adminRouter);
