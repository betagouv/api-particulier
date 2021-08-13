import {Request, Response, NextFunction} from 'express';

export const isAdminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userIsAdmin =
    req.user &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.user.email &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.user.email_verified &&
    process.env.ADMIN_USERS &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    process.env.ADMIN_USERS.split(',').includes(req.user.email);
  if (userIsAdmin) {
    next();
    return;
  }

  res.status(403).send('Forbidden');
};
