import {z} from 'zod';
import {inputValidationMiddlewareBuilder} from 'src/presentation/middlewares/input-validation.middleware';

export const dgfipInputSchema = z.object({
  referenceAvis: z.string().nonempty(),
  numeroFiscal: z.string().nonempty(),
});

export const dfdipInputValidationMiddleware =
  inputValidationMiddlewareBuilder(dgfipInputSchema);
