import {DGFIPDataProvider} from '../data-provider';
import {DGFIPInput, DGFIPOutput} from '../dto';

export class SvairDataProvider implements DGFIPDataProvider {
  fetch(input: DGFIPInput): Promise<DGFIPOutput> {
    throw new Error('Method not implemented.');
  }
}
