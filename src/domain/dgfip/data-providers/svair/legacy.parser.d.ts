import {DGFIPOutput} from '../../dto';

export {parseEuro as euro};
export function result(html: string): Promise<DGFIPOutput>;
declare function parseEuro(str: string): number;
