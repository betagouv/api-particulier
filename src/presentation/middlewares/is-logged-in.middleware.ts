import {Request, Response, NextFunction} from 'express';

export const isLoggedInMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userIsLoggedIn = req.user !== undefined;
  if (userIsLoggedIn) {
    next();
    return;
  }

  res.redirect('/login');
};
