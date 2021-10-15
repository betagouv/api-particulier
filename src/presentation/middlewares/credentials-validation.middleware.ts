import {Request, Response, NextFunction} from 'express';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {TokenValue} from 'src/domain/token-value';
import * as z from 'zod';

export async function credentialsValidationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKeyValidation = await z
    .string()
    .nonempty()
    .safeParseAsync(req.header('X-Api-Key'));
  const accesstokenValidation = await z
    .string()
    .nonempty()
    .regex(/^Bearer [\w]+/gi)
    .safeParseAsync(req.header('Authorization'));

  if (!apiKeyValidation.success && !accesstokenValidation.success) {
    return next(new TokenNotFoundError('' as TokenValue));
  }
  next();
}
