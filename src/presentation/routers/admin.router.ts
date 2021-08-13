import {Request, Response, Router} from 'express';
import {isAdminMiddleware} from 'src/presentation/middlewares/is-admin.middleware';

export const adminRouter = Router();

adminRouter.use(isAdminMiddleware);

adminRouter.use('/', (req: Request, res: Response) => {
  res.json(req.user);
});
