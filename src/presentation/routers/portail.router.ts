import {Router} from 'express';
import {listApplications} from 'src/presentation/controllers/list-applications.controller';
import {webappRouter} from 'src/presentation/routers/webapp.router';

export const portailRouter = Router();

portailRouter.use(webappRouter);
portailRouter.get('/', listApplications);
