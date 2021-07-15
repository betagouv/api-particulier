import {Request, Response, NextFunction} from 'express';
import * as z from 'zod';

export function inputValidationMiddlewareBuilder<T extends z.ZodRawShape>(
  inputSchema: z.ZodObject<T>
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
    next();
  };
}
