import {z} from 'zod';
import {inputValidationMiddlewareBuilder} from 'src/presentation/middlewares/input-validation.middleware';
import {CnafInput} from 'src/domain/data-fetching/data-providers/cnaf/dto';

export const cnafInputSchema = z.object({
  numeroAllocataire: z
    .string()
    .nonempty()
    .max(7)
    .regex(/[0-9]+/),
  codePostal: z.string().nonempty().max(5),
});

export const cnafInputValidationMiddleware =
  inputValidationMiddlewareBuilder<CnafInput>(cnafInputSchema);
