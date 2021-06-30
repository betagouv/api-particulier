import {DGFIPOutput} from './dto';
import {ScopesConfiguration} from '../property-based.scopes-filter';

export type DGFIPScope = 'dgfip_avis_imposition' | 'dgfip_adresse';

export const scopesConfiguration: ScopesConfiguration<DGFIPScope, DGFIPOutput> =
  {
    dgfip_avis_imposition: [],
    dgfip_adresse: [],
  };
