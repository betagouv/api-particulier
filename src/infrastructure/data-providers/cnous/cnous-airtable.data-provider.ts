import axios from 'axios';
import {CnousDataProvider} from 'src/domain/data-fetching/data-providers/cnous/data-provider';
import {
  CnousInput,
  CnousOutput,
  isFranceConnectIdentityInput,
  isIneInput,
} from 'src/domain/data-fetching/data-providers/cnous/dto';
import {transformError} from 'src/infrastructure/data-providers/error-transformer';
import {parseDate} from 'src/infrastructure/data-providers/parsers';
import {NotFoundError} from 'src/domain/data-fetching/data-providers/cnous/errors/not-found.error';

export class CnousAirtableDataProvider implements CnousDataProvider {
  async fetch(input: CnousInput): Promise<CnousOutput> {
    try {
      let data;
      if (isIneInput(input)) {
        const response = await axios.get(
          `${process.env.AIRTABLE_CNOUS_API_URL}/statut_boursier`,
          {
            headers: {Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`},
            params: {
              filterByFormula: `{ine} = '${input.ine}'`,
            },
            timeout: 10000,
          }
        );
        data = response.data;
      } else if (isFranceConnectIdentityInput(input)) {
        const response = await axios.get(
          `${process.env.AIRTABLE_CNOUS_API_URL}/statut_boursier`,
          {
            headers: {Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`},
            params: {
              filterByFormula: `AND({nom}='${input.family_name}', {prenoms}='${input.given_name}', {dateNaissance}='${input.birthdate}', {sexe}='${input.gender}', {lieuNaissance}='${input.birthplace}')`,
            },
            timeout: 10000,
          }
        );
        data = response.data;
      } else {
        const response = await axios.get(
          `${process.env.AIRTABLE_CNOUS_API_URL}/statut_boursier`,
          {
            headers: {Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`},
            params: {
              filterByFormula: `AND({nom}='${
                input.nom
              }', {prenoms}='${input.prenoms.join(
                ' '
              )}', {dateNaissance}='${input.dateNaissance.toISOString()}', {sexe}='${
                input.sexe
              }', {lieuNaissance}='${input.lieuNaissance}')`,
            },
            timeout: 10000,
          }
        );
        data = response.data;
      }
      if (data.records.length === 0) {
        throw new NotFoundError();
      }

      const fields = data.records[0].fields;

      const prenoms = fields.prenoms.split(' ');

      return {
        nom: fields.nom,
        prenom: prenoms[0],
        prenom2: prenoms.length > 1 ? prenoms[1].trim() : null,
        sexe: fields.sexe,
        dateNaissance: parseDate(fields.dateNaissance),
        lieuNaissance: fields.lieuNaissance,
        boursier: fields.boursier,
        echelonBourse: fields.echelonBourse,
        email: fields.email,
        dateDeRentree: parseDate(fields.dateDeRentree),
        dureeVersement: fields.dureeVersement,
        statut: fields.statut,
        statutLibelle:
          fields.statut === 0 ? 'définitif' : 'provisoire (conditionnel)',
        villeEtudes: fields.villeEtudes,
        etablissement: fields.etablissement,
      };
    } catch (error) {
      throw transformError(error);
    }
  }
}
