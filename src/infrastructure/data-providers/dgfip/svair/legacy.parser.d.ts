import {DgfipOutput} from '../../../../domain/data-fetching/data-providers/dgfip/dto';

export {parseEuro as euro};
export function result(html: string): Promise<DgfipOutput>;
declare function parseEuro(str: string): number;
