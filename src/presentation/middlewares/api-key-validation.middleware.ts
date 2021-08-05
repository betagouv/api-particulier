import {Request, Response, NextFunction} from 'express';
import * as z from 'zod';

export async function apiKeyValidationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const headerValidation = await z
    .string()
    .nonempty()
    .safeParseAsync(req.header('X-Api-Key'));

  if (!headerValidation.success) {
    return next(headerValidation.error);
  }
  next();
}
