import {ScopesConfiguration} from 'src/domain/administration/property-based.scopes-filter';
import {DGFIPOutput} from './dto';

export type DGFIPScope = 'dgfip_avis_imposition' | 'dgfip_adresse';

export const scopesConfiguration: ScopesConfiguration<DGFIPScope, DGFIPOutput> =
  {
    dgfip_avis_imposition: [],
    dgfip_adresse: [],
  };
