import axios from 'axios';
import {CnafDataProvider} from 'src/domain/data-fetching/data-providers/cnaf/data-provider';
import {
  CnafInput,
  CnafOutput,
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
        }
      );

      if (data.records.length === 0) {
        throw new CnafError(101);
      }

      const rawNotice = data.records[0].fields;

      console.log(rawNotice);
      return {
        allocataires: [],
        enfants: [],
        adresse: {},
        quotientFamilial: null,
        mois: null,
        annee: null,
      };
    } catch (error) {
      throw transformError(error);
    }
  }
}
