import {z} from 'zod';
import {inputValidationMiddlewareBuilder} from 'src/presentation/middlewares/input-validation.middleware';
import {DgfipInput} from 'src/domain/data-fetching/data-providers/dgfip/dto';

export const dgfipInputSchema = z
  .object({
    referenceAvis: z
      .string()
      .nonempty()
      .transform(str => str.replace(/[^a-zA-Z0-9]/g, '').slice(0, 13)),
    numeroFiscal: z
      .string()
      .nonempty()
      .transform(str => str.replace(/[^a-zA-Z0-9]/g, '').slice(0, 13)),
  })
  .transform(obj => ({
    taxNoticeNumber: obj.referenceAvis,
    taxNumber: obj.numeroFiscal,
  }));

export const dfdipInputValidationMiddleware =
  inputValidationMiddlewareBuilder<DgfipInput>(dgfipInputSchema);
