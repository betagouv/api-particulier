import {urlencoded} from 'body-parser';
import {Router} from 'express';
import {
  addUserToApplication,
  applicationDetails,
  listApplications,
} from 'src/presentation/controllers/list-applications.controller';
import {isAdminMiddleware} from 'src/presentation/middlewares/is-admin.middleware';

export const adminRouter = Router();

adminRouter.use(isAdminMiddleware);

adminRouter.get('/', listApplications);
adminRouter.get('/applications/:id', applicationDetails);
adminRouter.post(
  '/applications/:id/users',
  urlencoded({extended: true}),
  addUserToApplication
);
