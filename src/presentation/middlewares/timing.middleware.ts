import {Request, Response, NextFunction} from 'express';

export const timingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.startTime = new Date().getTime();
  next();
};
