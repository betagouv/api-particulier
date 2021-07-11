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

export type AnyScope = CnafScope | DgfipScope;

export const unifiedScopesConfiguration = {
  ...cnafScopesConfiguration,
  ...dgfipScopesConfiguration,
};
