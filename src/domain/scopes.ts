import {
  PoleEmploiScope,
  scopesConfiguration as poleEmploiScopesConfiguration,
} from 'src/domain/data-fetching/data-providers/pole-emploi/scopes';
import {
  CnafScope,
  scopesConfiguration as cnafScopesConfiguration,
} from './data-fetching/data-providers/cnaf/scopes';
import {
  DgfipScope,
  scopesConfiguration as dgfipScopesConfiguration,
} from './data-fetching/data-providers/dgfip/scopes';
import {
  MesriScope,
  scopesConfiguration as mesriScopesConfiguration,
} from './data-fetching/data-providers/mesri/scopes';

export type AnyScope = CnafScope | DgfipScope | PoleEmploiScope | MesriScope;

export const unifiedScopesConfiguration = {
  ...cnafScopesConfiguration,
  ...dgfipScopesConfiguration,
  ...poleEmploiScopesConfiguration,
  ...mesriScopesConfiguration,
};
