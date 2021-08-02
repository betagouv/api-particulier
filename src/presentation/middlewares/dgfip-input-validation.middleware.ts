import {z} from 'zod';
import {inputValidationMiddlewareBuilder} from 'src/presentation/middlewares/input-validation.middleware';

export const dgfipInputSchema = z
  .object({
    referenceAvis: z
      .string()
      .nonempty()
      .transform(str => str.replace(/[^a-zA-Z0-9]/g, '')),
    numeroFiscal: z
      .string()
      .nonempty()
      .transform(str => str.replace(/[^a-zA-Z0-9]/g, '')),
  })
  .transform(obj => ({
    taxNoticeNumber: obj.referenceAvis,
    taxNumber: obj.numeroFiscal,
  }));

export const dfdipInputValidationMiddleware =
  inputValidationMiddlewareBuilder(dgfipInputSchema);
