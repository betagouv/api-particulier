import {Request, Response, NextFunction} from 'express';
import {ParsedQs} from 'qs';
import * as z from 'zod';

export function inputValidationMiddlewareBuilder<O extends ParsedQs, D, I>(
  inputSchema: z.ZodSchema<O, D, I>,
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
