import {Request, Response, NextFunction} from 'express';

export const isAdminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userIsAdmin =
    req.user &&
    req.user.email &&
    req.user.email_verified &&
    process.env.ADMIN_USERS &&
    process.env.ADMIN_USERS.split(',').includes(req.user.email);
  if (userIsAdmin) {
    next();
    return;
  }

  res.status(403).send('Forbidden');
};
