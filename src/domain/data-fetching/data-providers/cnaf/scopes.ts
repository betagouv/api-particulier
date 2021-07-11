import {ScopesConfiguration} from 'src/domain/data-fetching/scopes-filters/property-based.scopes-filter';
import {CnafOutput} from './dto';

export type CnafScope =
  | 'cnaf_adresse'
  | 'cnaf_allocataires'
  | 'cnaf_enfants'
  | 'cnaf_quotient_familial';

export const scopesConfiguration: ScopesConfiguration<CnafScope, CnafOutput> = {
  cnaf_adresse: ['adresse'],
  cnaf_allocataires: ['allocataires'],
  cnaf_enfants: ['enfants'],
  cnaf_quotient_familial: ['quotientFamilial', 'mois', 'annee'],
};
