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
export const familySituation = {
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
export const incomeTaxBeforeCorrection = {
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

export class SvairResponseParser {
  parse(rawResponse: string) {
    const $ = cheerio.load(rawResponse);
    const cells = $('td').contents().toArray();
  }
}
