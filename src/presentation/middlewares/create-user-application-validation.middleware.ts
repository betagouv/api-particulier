import {scopesConfiguration} from 'src/domain/scopes';
import {inputValidationMiddlewareBuilder} from 'src/presentation/middlewares/input-validation.middleware';
import {z} from 'zod';

export const createUserApplicationDtoSchema = z
  .object({
    name: z.string().nonempty(),
    scopes: z
      .object(
        Object.keys(scopesConfiguration).reduce((acc, key) => {
          return {
            ...acc,
            [key]: z.literal('on'),
          };
        }, {})
      )
      .partial(),
  })
  .transform(obj => ({
    name: obj.name,
    scopes: Object.keys(obj.scopes),
  }));

export const createUserApplicationValidationMiddleware =
  inputValidationMiddlewareBuilder(createUserApplicationDtoSchema, 'body');
