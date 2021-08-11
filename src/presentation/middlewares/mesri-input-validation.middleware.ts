import {z} from 'zod';
import {inputValidationMiddlewareBuilder} from 'src/presentation/middlewares/input-validation.middleware';

export const mesriInputSchema = z.object({
  ine: z.string().nonempty(),
});

export const mesriInputValidationMiddleware =
  inputValidationMiddlewareBuilder(mesriInputSchema);
