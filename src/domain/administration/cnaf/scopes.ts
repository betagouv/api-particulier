import {ScopesConfiguration} from 'src/domain/administration/property-based.scopes-filter';
import {CNAFOutput} from './dto';

export type CNAFScope =
  | 'cnaf_adresse'
  | 'cnaf_allocataires'
  | 'cnaf_enfants'
  | 'cnaf_quotient_familial';

export const scopesConfiguration: ScopesConfiguration<CNAFScope, CNAFOutput> = {
  cnaf_adresse: ['adresse'],
  cnaf_allocataires: ['allocataires'],
  cnaf_enfants: ['enfants'],
  cnaf_quotient_familial: ['quotientFamilial', 'mois', 'annee'],
};
