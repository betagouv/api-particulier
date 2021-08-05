import {Request, Response, NextFunction} from 'express';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {TokenValue} from 'src/domain/token-value';
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
    return next(new TokenNotFoundError('' as TokenValue));
  }
  next();
}
