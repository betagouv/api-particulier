import {Request, Response, NextFunction} from 'express';
import {ParsedQs} from 'qs';
import * as z from 'zod';

export function inputValidationMiddlewareBuilder<O extends ParsedQs, D, I>(
  inputSchema: z.ZodSchema<O, D, I>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const headerValidation = await z
      .string()
      .safeParseAsync(req.header('X-Api-Key'));

    if (!headerValidation.success) {
      return next(headerValidation.error);
    }

    const inputValidation = await inputSchema.safeParseAsync(req.query);

    if (!inputValidation.success) {
      return next(inputValidation.error);
    }

    req.query = inputSchema.parse(req.query);
    next();
  };
}
