import axios from 'axios';
import {DgfipDataProvider} from 'src/domain/data-fetching/data-providers/dgfip/data-provider';
import {
  DgfipInput,
  DgfipOutput,
} from 'src/domain/data-fetching/data-providers/dgfip/dto';
import {InvalidCredentialsError} from 'src/domain/data-fetching/data-providers/dgfip/errors/invalid-credentials.error';
import {
  parseDateOrString,
  parseEuro,
} from 'src/infrastructure/data-providers/dgfip/parsing-functions';
import {transformError} from 'src/infrastructure/data-providers/error-transformer';

export class AirtableDgfipDataProvider implements DgfipDataProvider {
  async fetch(input: DgfipInput): Promise<DgfipOutput> {
    try {
      const {data} = await axios.get(
        `${process.env.AIRTABLE_DGFIP_API_URL}/AvisImposition`,
        {
          headers: {Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`},
          params: {
            filterByFormula: `AND({numeroFiscal}='${input.taxNumber}', {numeroAvisImposition}='${input.taxNoticeNumber}')`,
          },
        }
      );

      if (data.records.length === 0) {
        throw new InvalidCredentialsError();
      }

      const rawNotice = data.records[0].fields;
      return {
        declarant1: {
          nom: rawNotice['declarant1.nom'],
          nomNaissance: rawNotice['declarant1.nomNaissance'],
          prenoms: rawNotice['declarant1.prenoms'],
          dateNaissance: parseDateOrString(
            rawNotice['declarant1.dateNaissance']
          ),
        },
        declarant2: {
          nom: rawNotice['declarant2.nom'],
          nomNaissance: rawNotice['declarant2.nomNaissance'],
          prenoms: rawNotice['declarant2.prenoms'],
          dateNaissance: parseDateOrString(
            rawNotice['declarant2.dateNaissance']
          ),
        },
        dateRecouvrement: rawNotice.dateRecouvrement
          ? parseDateOrString(rawNotice.dateRecouvrement)
          : undefined,
        dateEtablissement: rawNotice.dateEtablissement
          ? parseDateOrString(rawNotice.dateEtablissement)
          : undefined,
        nombreParts: parseFloat(rawNotice.nombreParts),
        situationFamille: rawNotice.situationFamille,
        nombrePersonnesCharge: parseInt(rawNotice.nombreDePersonnesACharge),
        revenuBrutGlobal: parseEuro(rawNotice.revenuBrutGlobal),
        revenuImposable: parseEuro(rawNotice.revenuImposable),
        impotRevenuNetAvantCorrections: parseEuro(
          rawNotice.impotRevenuNetAvantCorrections
        ),
        montantImpot: parseEuro(rawNotice.montantImpot),
        revenuFiscalReference: parseEuro(rawNotice.revenuFiscalReference),
        foyerFiscal: {
          annee: parseInt(rawNotice.anneeImpots),
          adresse:
            rawNotice['adresse.ligne1'] +
            ' ' +
            rawNotice['adresse.codePostal'] +
            ' ' +
            rawNotice['adresse.commune'],
        },
        anneeImpots: parseInt(rawNotice.anneeImpots),
        anneeRevenus: parseInt(rawNotice.anneeRevenus),
        erreurCorrectif: rawNotice.erreurCorrectif,
        situationPartielle: rawNotice.situationPartielle,
      };
    } catch (error) {
      throw transformError(error);
    }
  }
}
