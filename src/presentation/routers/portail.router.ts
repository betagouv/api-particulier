import {Router} from 'express';
import {listApplications} from 'src/presentation/controllers/list-applications.controller';
import {adminRouter} from 'src/presentation/routers/admin.router';
import {webappRouter} from 'src/presentation/routers/webapp.router';

export const portailRouter = Router();

portailRouter.use(webappRouter);
portailRouter.get('/', listApplications);
portailRouter.get('/admin', adminRouter);
