import {z} from 'zod';
import {inputValidationMiddlewareBuilder} from 'src/presentation/middlewares/input-validation.middleware';
import {
  PoleEmploiId,
  PoleEmploiInput,
} from 'src/domain/data-fetching/data-providers/pole-emploi/dto';

export const poleEmploiInputSchema = z
  .object({
    identifiant: z.string().nonempty(),
  })
  .transform(obj => ({id: <PoleEmploiId>obj.identifiant}));

export const poleEmploiInputValidationMiddleware =
  inputValidationMiddlewareBuilder<PoleEmploiInput>(poleEmploiInputSchema);
