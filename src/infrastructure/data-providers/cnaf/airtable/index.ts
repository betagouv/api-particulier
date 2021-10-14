import axios from 'axios';
import {CnafDataProvider} from 'src/domain/data-fetching/data-providers/cnaf/data-provider';
import {
  CnafInput,
  CnafOutput,
  Person,
} from 'src/domain/data-fetching/data-providers/cnaf/dto';
import {CnafError} from 'src/domain/data-fetching/data-providers/cnaf/errors/cnaf.error';
import {transformError} from 'src/infrastructure/data-providers/error-transformer';

export class AirtableCnafDataProvider implements CnafDataProvider {
  async fetch(input: CnafInput): Promise<CnafOutput> {
    try {
      const {data} = await axios.get(
        `${process.env.AIRTABLE_CNAF_API_URL}/Foyers`,
        {
          headers: {Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`},
          params: {
            filterByFormula: `AND({numeroAllocataire}='${input.numeroAllocataire}', {codePostal}='${input.codePostal}')`,
          },
          timeout: 10000,
        }
      );

      if (data.records.length === 0) {
        throw new CnafError(101);
      }

      const rawNotice = data.records[0].fields;

      const allocataires: Person[] = await Promise.all(
        rawNotice.allocataires.map(getPersonne)
      );
      const enfants: Person[] = await Promise.all(
        rawNotice.enfants.map(getPersonne)
      );

      return {
        allocataires,
        enfants,
        adresse: {
          codePostalVille: rawNotice['adresse.codePostalVille'],
          complementIdentite: rawNotice['adresse.complementIdentite'],
          complementIdentiteGeo: rawNotice['adresse.complementIdentiteGeo'],
          identite: rawNotice['adresse.identite'],
          lieuDit: rawNotice['adresse.lieuDit'],
          numeroRue: rawNotice['adresse.numeroRue'],
          pays: rawNotice['adresse.pays'],
        },
        quotientFamilial: rawNotice.quotientFamilial,
        mois: rawNotice.mois,
        annee: rawNotice.annee,
      };
    } catch (error) {
      throw transformError(error);
    }
  }
}

const getPersonne = async (personId: string): Promise<Person> => {
  const {data} = await axios.get(
    `${process.env.AIRTABLE_CNAF_API_URL}/Personnes/${personId}`,
    {
      headers: {Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`},
    }
  );

  return {
    nomPrenom: data.fields.nomPrenom,
    dateDeNaissance: new Date(data.fields.dateDeNaissance),
    sexe: data.fields.sexe,
  };
};
