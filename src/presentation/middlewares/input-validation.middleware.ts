import {Request, Response, NextFunction} from 'express';
import * as z from 'zod';
import {ZodTypeDef} from 'zod';

export function inputValidationMiddlewareBuilder<O>(
  inputSchema: z.Schema<O, ZodTypeDef, unknown>,
  source: 'query' | 'body' = 'query'
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const inputValidation = await inputSchema.safeParseAsync(req[source]);

    if (!inputValidation.success) {
      return next(inputValidation.error);
    }

    res.locals.input = inputSchema.parse(req[source]);
    next();
  };
}
