import {z} from 'zod';
import {inputValidationMiddlewareBuilder} from 'src/presentation/middlewares/input-validation.middleware';

export const cnafInputSchema = z.object({
  numeroAllocataire: z.string().nonempty(),
  codePostal: z.string().nonempty(),
});

export const cnafInputValidationMiddleware =
  inputValidationMiddlewareBuilder(cnafInputSchema);
