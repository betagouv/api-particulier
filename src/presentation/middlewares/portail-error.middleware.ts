import {NextFunction, Request, Response} from 'express';
import {scopesConfiguration} from 'src/presentation/controllers/list-user-applications.controller';
import {ZodError} from 'zod';

export const portailErrorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    res.status(422).render('includes/new-application', {
      scopesConfiguration,
      errors: error.format(),
      input: req.body,
    });
    return;
  }
  next();
};
