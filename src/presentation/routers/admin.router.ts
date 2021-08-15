import {Request, Response, Router} from 'express';
import {listApplications} from 'src/presentation/controllers/list-applications.controller';
import {isAdminMiddleware} from 'src/presentation/middlewares/is-admin.middleware';

export const adminRouter = Router();

adminRouter.use(isAdminMiddleware);

adminRouter.use('/', listApplications);
