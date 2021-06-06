import {pick} from 'lodash';
import {Scope} from '../application/application.aggregate';
import {DGFIPOutput} from './dto';
import {ScopesFilter} from '../application/scopes.filter';

export class DGFIPScopesFilter implements ScopesFilter<DGFIPOutput> {
  filter(unfilteredData: DGFIPOutput, scopes: Scope[]) {
    if (scopes.includes('dgfip_avis_imposition')) {
      return unfilteredData;
    }
    if (scopes.includes('dgfip_adresse')) {
      return pick(unfilteredData, [
        'declarant1',
        'declarant2',
        'foyerFiscal',
        'anneeImpots',
        'anneeRevenus',
        'erreurCorrectif',
        'situationPartielle',
      ]);
    }
    return {};
  }
}
