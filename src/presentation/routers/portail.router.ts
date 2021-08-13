import {Router} from 'express';
import {listApplications} from 'src/presentation/controllers/list-applications.controller';
import {isLoggedInMiddleware} from 'src/presentation/middlewares/is-logged-in.middleware';
import {adminRouter} from 'src/presentation/routers/admin.router';
import {webappRouter} from 'src/presentation/routers/webapp.router';

export const portailRouter = Router();

portailRouter.use(webappRouter);
portailRouter.use(isLoggedInMiddleware);
portailRouter.get('/', listApplications);
portailRouter.get('/admin', adminRouter);
