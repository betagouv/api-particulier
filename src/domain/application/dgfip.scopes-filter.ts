import {Scope} from './application.aggregate';
import {DGFIPOutput} from './dgfip.dto';
import {ScopesFilter} from './scopes.filter';

export class DGFIPScopesFilter implements ScopesFilter<DGFIPOutput> {
  filter(unfilteredData: DGFIPOutput, scopes: Scope[]) {
    return unfilteredData;
  }
}
