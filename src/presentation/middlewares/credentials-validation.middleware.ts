import {Request, Response, NextFunction} from 'express';
import {Credentials} from 'src/domain/credentials';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {TooManyCredentialsError} from 'src/domain/data-fetching/errors/too-many-credentials.error';
import {TokenValue} from 'src/domain/token-value';
import * as z from 'zod';

const accessTokenRegex = /^Bearer (.+)/i;

export async function credentialsValidationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKeyValidation = await z
    .string()
    .nonempty()
    .transform(
      value =>
        ({
          tokenValue: value,
          type: 'api-key',
        } as Credentials)
    )
    .safeParseAsync(req.header('X-Api-Key'));
  const accesstokenValidation = await z
    .string()
    .nonempty()
    .regex(accessTokenRegex)
    .transform(
      value =>
        ({
          tokenValue: value.match(accessTokenRegex)![1],
          type: 'access-token',
        } as Credentials)
    )
    .safeParseAsync(req.header('Authorization'));

  const noCredentials =
    !apiKeyValidation.success && !accesstokenValidation.success;
  const tooManyCredentials =
    apiKeyValidation.success && accesstokenValidation.success;
  if (noCredentials) {
    return next(new TokenNotFoundError('' as TokenValue));
  }
  if (tooManyCredentials) {
    return next(new TooManyCredentialsError());
  }

  if (apiKeyValidation.success) {
    res.locals.credentials = apiKeyValidation.data;
    next();
    return;
  }
  if (accesstokenValidation.success) {
    res.locals.credentials = accesstokenValidation.data;
    next();
    return;
  }
}
