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

export const isCnafScope = (scope: AnyScope): scope is CnafScope =>
  scope.startsWith('cnaf_');

export const isDgfipScope = (scope: AnyScope): scope is DgfipScope =>
  scope.startsWith('dgfip_');

export const isPoleEmploiScope = (scope: AnyScope): scope is PoleEmploiScope =>
  scope.startsWith('pole_emploi_');

export type AnyScope = CnafScope | DgfipScope | PoleEmploiScope;

export const unifiedScopesConfiguration = {
  ...cnafScopesConfiguration,
  ...dgfipScopesConfiguration,
  ...poleEmploiScopesConfiguration,
};
