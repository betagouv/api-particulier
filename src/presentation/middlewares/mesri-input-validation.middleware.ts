import {z} from 'zod';
import {inputValidationMiddlewareBuilder} from 'src/presentation/middlewares/input-validation.middleware';
import {parse} from 'date-fns';
import {
  MesriId,
  MesriInput,
} from 'src/domain/data-fetching/data-providers/mesri/dto';

export const mesriInputSchema = z.union([
  z
    .object({
      ine: z.string().regex(/^[0-9a-zA-Z]{11}$/),
    })
    .transform(({ine}) => ({
      ine: <MesriId>ine.toUpperCase(),
    })),
  z
    .object({
      nom: z.string().min(1),
      prenom: z.string().min(1),
      dateDeNaissance: z.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/),
      lieuDeNaissance: z.string().min(1).optional(),
      sexe: z.string().min(1).max(1),
    })
    .transform(({sexe, prenom, nom, dateDeNaissance, lieuDeNaissance}) => ({
      sexe,
      prenom,
      nomFamille: nom,
      dateNaissance: parse(dateDeNaissance, 'yyyy-MM-dd', new Date()),
      lieuNaissance: lieuDeNaissance,
    })),
]);

export const mesriInputValidationMiddleware =
  inputValidationMiddlewareBuilder<MesriInput>(mesriInputSchema);
