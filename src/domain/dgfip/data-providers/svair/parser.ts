import * as cheerio from 'cheerio';
import {parse} from 'date-fns';
import * as _ from 'lodash';
import {DGFIPOutput} from '../../dto';

export type Matcher<T> = {
  regex: RegExp;
  format: (raw: string) => T;
  valueInSecondColumn?: true;
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
    cells[matchingCellIndex + (matcher.valueInSecondColumn ? 2 : 1)].data;

  if (value === undefined) {
    return;
  }

  return matcher.format(value);
}

export const formatString = (str: string) => str.trim();
export const formatDate = (str: string) => parse(str, 'dd/MM/yyyy', new Date());

export class SvairResponseParser {
  parse(rawResponse: string) {
    const $ = cheerio.load(rawResponse);
    const cells = $('td').contents().toArray();
  }
}
