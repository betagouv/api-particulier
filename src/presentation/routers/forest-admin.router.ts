import {NextFunction, Request, Response, Router} from 'express';

import forestApp from 'src/presentation/admin/app';

export const forestAdminRouter = Router();

forestAdminRouter.use(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    req.url = '/forest' + req.url;
    next();
  }
);
forestAdminRouter.use('/', forestApp);
