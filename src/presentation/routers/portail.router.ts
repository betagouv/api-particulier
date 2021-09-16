import {urlencoded} from 'body-parser';
import {Router} from 'express';
import {createPortailApplicationController} from 'src/presentation/controllers/create-portail-application.controller';
import {listUserApplications} from 'src/presentation/controllers/list-user-applications.controller';
import {removePortailApplicationController} from 'src/presentation/controllers/remove-portail-application.controller';
import {isLoggedInMiddleware} from 'src/presentation/middlewares/is-logged-in.middleware';
import {adminRouter} from 'src/presentation/routers/admin.router';
import {webappRouter} from 'src/presentation/routers/webapp.router';

export const portailRouter = Router();

portailRouter.use(webappRouter);
portailRouter.use(isLoggedInMiddleware);
portailRouter.get('/', listUserApplications);
if (process.env.SANDBOXED === 'true') {
  portailRouter.post(
    '/new',
    urlencoded({extended: true}),
    createPortailApplicationController
  );

  portailRouter.delete(
    '/applications/:id',
    urlencoded({extended: true}),
    removePortailApplicationController
  );
}
portailRouter.use('/admin', adminRouter);
