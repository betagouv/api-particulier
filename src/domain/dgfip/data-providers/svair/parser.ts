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

export class SvairResponseParser {
  parse(rawResponse: string) {
    const $ = cheerio.load(rawResponse);
    const cells = $('td').contents().toArray();
  }
}
