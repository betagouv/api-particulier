import axios from 'axios';
import {PoleEmploiDataProvider} from 'src/domain/data-fetching/data-providers/pole-emploi/data-provider';
import {
  PoleEmploiInput,
  PoleEmploiOutput,
} from 'src/domain/data-fetching/data-providers/pole-emploi/dto';
import {NotFoundError} from 'src/domain/data-fetching/data-providers/pole-emploi/errors/not-found.error';
import {transformError} from 'src/infrastructure/data-providers/error-transformer';

export class PoleEmploiAirtableDataProvider implements PoleEmploiDataProvider {
  async fetch(input: PoleEmploiInput): Promise<PoleEmploiOutput> {
    try {
      const {data} = await axios.get(
        `${process.env.AIRTABLE_POLE_EMPLOI_API_URL}/Individus`,
        {
          headers: {Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`},
          params: {
            filterByFormula: `{identifiant} = '${input.id}'`,
          },
        }
      );

      if (data.records.length === 0) {
        throw new NotFoundError(input.id);
      }

      const fields = data.records[0].fields;

      return {
        identifiant: fields.identifiant,
        civilite: fields.civilite,
        nom: fields.nom,
        nomUsage: fields.nomUsage,
        prenom: fields.prenom,
        sexe: fields.sexe,
        dateNaissance: fields.dateNaissance
          ? new Date(fields.dateNaissance)
          : undefined,
        codeCertificationCNAV: fields.codeCertificationCNAV,
        telephone: fields.telephone,
        telephone2: fields.telephone2,
        email: fields.email,
        adresse: {
          INSEECommune: fields.INSEECommune,
          codePostal: fields.codePostal,
          localite: fields.localite,
          ligneVoie: fields.ligneVoie,
          ligneComplementDestinataire: fields.ligneComplementDestinataire,
          ligneComplementAdresse: fields.ligneComplementAdresse,
          ligneComplementDistribution: fields.ligneComplementDistribution,
          ligneNom: fields.ligneNom,
        },
        dateInscription: fields.dateInscription
          ? new Date(fields.dateInscription)
          : undefined,
        dateCessationInscription: fields.dateCessationInscription
          ? new Date(fields.dateCessationInscription)
          : undefined,
        codeCategorieInscription: fields.codeCategorieInscription,
        libelleCategorieInscription: fields.libelleCategorieInscription,
      };
    } catch (error) {
      throw transformError(error);
    }
  }
}
