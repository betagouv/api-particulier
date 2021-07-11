import {
  CnafScope,
  scopesConfiguration as cnafScopesConfiguration,
} from './data-providers/cnaf/scopes';
import {
  DGFIPScope,
  scopesConfiguration as dgfipScopesConfiguration,
} from './data-providers/dgfip/scopes';

export const isCnafScope = (scope: AnyScope): scope is CnafScope =>
  scope.startsWith('cnaf_');

export const isDGFIPScope = (scope: AnyScope): scope is DGFIPScope =>
  scope.startsWith('dgfip_');

export type AnyScope = CnafScope | DGFIPScope;

export const unifiedScopesConfiguration = {
  ...cnafScopesConfiguration,
  ...dgfipScopesConfiguration,
};
