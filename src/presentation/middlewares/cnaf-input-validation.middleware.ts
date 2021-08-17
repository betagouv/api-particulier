import {z} from 'zod';
import {inputValidationMiddlewareBuilder} from 'src/presentation/middlewares/input-validation.middleware';
import {CnafInput} from 'src/domain/data-fetching/data-providers/cnaf/dto';

export const cnafInputSchema = z.object({
  numeroAllocataire: z.string().nonempty(),
  codePostal: z.string().nonempty(),
});

export const cnafInputValidationMiddleware =
  inputValidationMiddlewareBuilder<CnafInput>(cnafInputSchema);
