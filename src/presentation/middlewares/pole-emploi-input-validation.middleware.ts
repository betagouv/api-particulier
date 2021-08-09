import {z} from 'zod';
import {inputValidationMiddlewareBuilder} from 'src/presentation/middlewares/input-validation.middleware';

export const poleEmploiInputSchema = z
  .object({
    identifiant: z.string().nonempty(),
  })
  .transform(obj => ({id: obj.identifiant}));

export const poleEmploiInputValidationMiddleware =
  inputValidationMiddlewareBuilder(poleEmploiInputSchema);
