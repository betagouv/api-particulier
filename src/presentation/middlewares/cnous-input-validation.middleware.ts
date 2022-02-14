import {z} from 'zod';
import {inputValidationMiddlewareBuilder} from 'src/presentation/middlewares/input-validation.middleware';
import {parse} from 'date-fns';
import {
  CnousId,
  CnousInput,
} from 'src/domain/data-fetching/data-providers/cnous/dto';

export const cnousInputSchema = z.union([
  z
    .object({
      ine: z.string().regex(/^[0-9a-zA-Z]{11}$/),
    })
    .transform(({ine}) => ({
      ine: <CnousId>ine.toUpperCase(),
    })),
  z
    .object({
      nom: z.string().min(1),
      prenoms: z.string().min(1),
      dateDeNaissance: z.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/),
      lieuDeNaissance: z.string().min(1),
      sexe: z.string().min(1).max(1),
    })
    .transform(({sexe, prenoms, nom, dateDeNaissance, lieuDeNaissance}) => ({
      sexe,
      prenoms,
      nom,
      dateNaissance: parse(dateDeNaissance, 'yyyy-MM-dd', new Date()),
      lieuNaissance: lieuDeNaissance,
    })),
]);

export const cnousInputValidationMiddleware =
  inputValidationMiddlewareBuilder<CnousInput>(cnousInputSchema);
