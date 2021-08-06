import {identity, uniq} from 'lodash';
import {inputValidationMiddlewareBuilder} from 'src/presentation/middlewares/input-validation.middleware';
import {z} from 'zod';

export const createApplicationDtoSchema = z
  .object({
    name: z.string().nonempty(),
    data_pass_id: z.string().nonempty(),
    technical_contact_email: z.string().email().nonempty(),
    author_email: z.string().email().nonempty(),
    scopes: z.array(z.string().nonempty()),
  })
  .transform(obj => ({
    name: obj.name,
    dataPassId: obj.data_pass_id,
    userEmails: uniq(
      [obj.technical_contact_email, obj.author_email].filter(identity)
    ),
  }));

export const createApplicationValidationMiddleware =
  inputValidationMiddlewareBuilder(createApplicationDtoSchema, 'body');
