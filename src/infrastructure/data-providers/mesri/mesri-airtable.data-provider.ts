import axios from 'axios';
import {lowerCase} from 'lodash';
import {MesriDataProvider} from 'src/domain/data-fetching/data-providers/mesri/data-provider';
import {
  Inscription,
  MesriInput,
  MesriOutput,
} from 'src/domain/data-fetching/data-providers/mesri/dto';
import {NotFoundError} from 'src/domain/data-fetching/data-providers/mesri/errors/not-found.error';
import {transformError} from 'src/infrastructure/data-providers/error-transformer';

export class MesriAirtableDataProvider implements MesriDataProvider {
  async fetch(input: MesriInput): Promise<MesriOutput> {
    try {
      const {data} = await axios.get(
        `${process.env.AIRTABLE_MESRI_API_URL}/%C3%89tudiants`,
        {
          headers: {Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`},
          params: {
            filterByFormula: `{ine} = '${input.ine}'`,
          },
        }
      );

      if (data.records.length === 0) {
        throw new NotFoundError(input.ine);
      }

      const fields = data.records[0].fields;

      const inscriptions: Inscription[] = await Promise.all(
        fields.inscriptions.map(getInscription)
      );

      return {
        ine: fields.ine,
        dateNaissance: new Date(fields.dateNaissance),
        nom: fields.nom,
        prenom: fields.prenom,
        inscriptions,
      };
    } catch (error) {
      throw transformError(error);
    }
  }
}

const getInscription = async (inscriptionId: string): Promise<Inscription> => {
  const {data} = await axios.get(
    `${process.env.AIRTABLE_MESRI_API_URL}/Inscriptions/${inscriptionId}`,
    {
      headers: {Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`},
    }
  );

  return {
    dateDebutInscription: new Date(data.fields.dateDebutInscription),
    dateFinInscription: new Date(data.fields.dateFinInscription),
    statut: lowerCase(data.fields.statut.trim()) as 'admis' | 'inscrit',
    regime: lowerCase(data.fields.regime.trim()) as
      | 'formation initiale'
      | 'formation continue',
    codeCommune: data.fields.codeCommune,
    etablissement: {
      uai: data.fields.uaiEtablissement,
      nom: data.fields.nomEtablissement,
    },
  };
};
