import {z} from 'zod';
import {inputValidationMiddlewareBuilder} from 'src/presentation/middlewares/input-validation.middleware';

export const dgfipInputSchema = z.object({
  referenceAvis: z.string(),
  numeroFiscal: z.string(),
});

export const dfdipInputValidationMiddleware =
  inputValidationMiddlewareBuilder(dgfipInputSchema);
