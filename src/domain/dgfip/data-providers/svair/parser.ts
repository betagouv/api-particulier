import * as cheerio from 'cheerio';
import {parse} from 'date-fns';
import * as _ from 'lodash';
import {DGFIPOutput} from '../../dto';

export type Matcher<T> = {
  regex: RegExp;
  format: (raw: string) => T;
  offset?: number;
};

export function match<T>(
  cells: cheerio.Element[],
  matcher: Matcher<T>
): T | undefined {
  const matchingCellIndex = _.findIndex(cells, (cell: cheerio.Element) => {
    const matches = cell.data?.match(matcher.regex);
    if (!matches) {
      return false;
    }
    return matches.length > 0;
  });

  if (matchingCellIndex === -1) {
    return;
  }

  const value =
    cells[matchingCellIndex + (matcher.offset ? matcher.offset : 1)].data;

  if (value === undefined) {
    return;
  }

  return matcher.format(value);
}

export const formatString = (str: string) => str.trim();
export const formatDate = (str: string) =>
  parse(str.trim(), 'dd/MM/yyyy', new Date());
export const formatMoney = (str: string): number | undefined => {
  const parsedNumber = str.replace(/[^0-9]/g, '');
  if (parsedNumber === '') {
    return;
  }
  return parseInt(parsedNumber);
};
export const formatFloat = (str: string) => parseFloat(str.trim());
export const formatInt = (str: string) => parseInt(str.trim());

export const name1Matcher = {
  regex: /^Nom(?! de)(?!bre)/,
  format: formatString,
};
export const name2Matcher = {
  regex: /^Nom(?! de)(?!bre)/,
  format: formatString,
  offset: 2,
};
export const birthName1Matcher = {
  regex: /^Nom de naissance/,
  format: formatString,
};
export const birthName2Matcher = {
  regex: /^Nom de naissance/,
  format: formatString,
  offset: 2,
};
export const firstname1Matcher = {
  regex: /^Prénom/,
  format: formatString,
};
export const firstname2Matcher = {
  regex: /^Prénom/,
  format: formatString,
  offset: 2,
};
export const birthdate1Matcher = {
  regex: /^Date de naissance/,
  format: formatDate,
};
export const birthdate2Matcher = {
  regex: /^Date de naissance/,
  format: formatDate,
  offset: 2,
};
export const addressLine1Matcher = {
  regex: /Adresse déclarée/,
  format: formatString,
  offset: 3,
};
export const addressLine2Matcher = {
  regex: /Adresse déclarée/,
  format: formatString,
  offset: 6,
};
export const collectionDateMatcher = {
  regex: /^Date de mise en recouvrement/,
  format: formatDate,
};
export const noticeCreationDateMatcher = {
  regex: /^Date d'établissement/,
  format: formatDate,
};
export const sharesCountMatcher = {
  regex: /^Nombre de part/,
  format: formatFloat,
};
export const familySituationMatcher = {
  regex: /Situation de famille/,
  format: formatString,
};
export const dependentsMatcher = {
  regex: /^Nombre de personne/,
  format: formatInt,
};
export const rawIncomeMatcher = {
  regex: /^Revenu brut global/,
  format: formatMoney,
};
export const taxableIncomeMatcher = {
  regex: /^Revenu imposable/,
  format: formatMoney,
};
export const incomeTaxBeforeCorrectionMatcher = {
  regex: /^Impôt sur le revenu net avant/,
  format: formatMoney,
};
export const taxAmountMatcher = {
  regex: /^Montant de l'imp/,
  format: formatMoney,
};
export const referenceIncomeMatcher = {
  regex: /^Revenu fiscal de référence/,
  format: formatMoney,
};

export function getYears($: cheerio.Root): {
  taxationYear?: number;
  incomeYear?: number;
} {
  const yearsLine = $('.titre_affiche_avis>span').text();
  if (yearsLine === undefined || yearsLine === '') {
    return {};
  }
  const matches = yearsLine.match(/(\d{4})/g);
  if (matches === undefined || matches === null || matches.length < 2) {
    return {};
  }
  return {
    taxationYear: parseInt(matches[0]),
    incomeYear: parseInt(matches[1]),
  };
}

const getAddress = (cells: cheerio.Element[]) => {
  const addressLine1 = match(cells, addressLine1Matcher);
  const addressLine2 = match(cells, addressLine2Matcher);
  if (addressLine1 === undefined && addressLine2 === undefined) {
    return;
  }
  return `${addressLine1} ${addressLine2}`.trim();
};

export class SvairResponseParser {
  parse(rawResponse: string): DGFIPOutput {
    const $ = cheerio.load(rawResponse);
    const cells = $('td').contents().toArray();

    const {taxationYear, incomeYear} = getYears($);
    return {
      declarant1: {
        nom: match(cells, name1Matcher),
        prenoms: match(cells, firstname1Matcher),
        nomNaissance: match(cells, birthName1Matcher),
        dateNaissance: match(cells, birthdate1Matcher),
      },
      declarant2: {
        nom: match(cells, name2Matcher),
        prenoms: match(cells, firstname2Matcher),
        nomNaissance: match(cells, birthName2Matcher),
        dateNaissance: match(cells, birthdate2Matcher),
      },
      foyerFiscal: {
        annee: taxationYear,
        adresse: getAddress(cells),
      },
      anneeImpots: taxationYear?.toString(),
      anneeRevenus: incomeYear?.toString(),
      dateEtablissement: match(cells, noticeCreationDateMatcher),
      dateRecouvrement: match(cells, collectionDateMatcher),
      impotRevenuNetAvantCorrections: match(
        cells,
        incomeTaxBeforeCorrectionMatcher
      ),
      montantImpot: match(cells, taxAmountMatcher),
      nombreParts: match(cells, sharesCountMatcher),
      nombrePersonnesCharge: match(cells, dependentsMatcher),
      revenuBrutGlobal: match(cells, rawIncomeMatcher),
      revenuFiscalReference: match(cells, referenceIncomeMatcher),
      revenuImposable: match(cells, taxableIncomeMatcher),
      situationFamille: match(cells, familySituationMatcher),
    };
  }
}
