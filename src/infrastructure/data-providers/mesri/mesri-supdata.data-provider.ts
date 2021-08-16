import axios from 'axios';
import {format} from 'date-fns';
import {MesriDataProvider} from 'src/domain/data-fetching/data-providers/mesri/data-provider';
import {
  Inscription,
  isIneInput,
  MesriInput,
  MesriMetadata,
  MesriOutput,
} from 'src/domain/data-fetching/data-providers/mesri/dto';
import {NotFoundError} from 'src/domain/data-fetching/data-providers/mesri/errors/not-found.error';
import {transformError} from 'src/infrastructure/data-providers/error-transformer';

export class MesriSupdataDataProvider implements MesriDataProvider {
  async fetch(
    input: MesriInput,
    metadata: MesriMetadata
  ): Promise<MesriOutput> {
    try {
      let data;
      if (isIneInput(input)) {
        const response = await axios.get(
          `${process.env.SUPDATA_API_URL}/api/etudiant`,
          {
            headers: {
              'X-API-Key': process.env.SUPDATA_INE_API_KEY,
              'X-Caller': metadata.caller,
            },
            params: {
              INE: input.ine,
            },
          }
        );
        data = response.data;
      } else {
        const response = await axios.post(
          `${process.env.SUPDATA_API_URL}/api/etudiant`,
          {
            prenom1: input.prenom,
            nomFamille: input.nomFamille,
            dateNaissance: format(input.dateNaissance, 'yyyy-MM-dd'),
            sexe: input.sexe,
            lieuNaissance: input.lieuNaissance,
          },
          {
            headers: {
              'X-API-Key': process.env.SUPDATA_CIVILITE_API_KEY,
              'X-Caller': metadata.caller,
            },
          }
        );
        data = response.data;
      }

      return {
        ine: data.ine,
        dateNaissance: new Date(data.dateNaissance),
        nom: data.nomFamille,
        prenom: data.prenom,
        inscriptions: data.inscriptions.map((inscription: Inscription) => ({
          ...inscription,
          dateDebutInscription: new Date(inscription.dateDebutInscription),
          dateFinInscription: new Date(inscription.dateFinInscription),
        })),
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundError();
      }
      throw transformError(error);
    }
  }
}
