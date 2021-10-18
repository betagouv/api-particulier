import {Request, Response, NextFunction} from 'express';
import * as z from 'zod';
import {ZodTypeDef} from 'zod';

export function inputValidationMiddlewareBuilder<O>(
  inputSchema: z.Schema<O, ZodTypeDef, unknown>,
  source: 'query' | 'body' = 'query'
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const inputValidation = await inputSchema.safeParseAsync(req[source]);

    if (!inputValidation.success && req.header('Authorization') === undefined) {
      return next(inputValidation.error);
    }

    if (inputValidation.success) {
      res.locals.input = inputValidation.data;
    }
    next();
  };
}
