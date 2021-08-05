import {Request, Response, NextFunction} from 'express';
import {errorPresenter} from 'src/presentation/presenters/error-presenters/error-presenter';

export const manageErrorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {statusCode, ...payload} = errorPresenter(error);
  res.status(statusCode).json(payload);

  return next();
};
