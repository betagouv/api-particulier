import {ScopesConfiguration} from 'src/domain/gateway/scopes-filters/property-based.scopes-filter';
import {DgfipOutput} from './dto';

export type DgfipScope = 'dgfip_avis_imposition' | 'dgfip_adresse';

export const scopesConfiguration: ScopesConfiguration<DgfipScope, DgfipOutput> =
  {
    dgfip_avis_imposition: [],
    dgfip_adresse: [],
  };
