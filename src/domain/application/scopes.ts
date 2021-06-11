import {
  CNAFScope,
  scopesConfiguration as cnafScopesConfiguration,
} from '../cnaf/scopes';
import {
  DGFIPScope,
  scopesConfiguration as dgfipScopesConfiguration,
} from '../dgfip/scopes';

export const isCNAFScope = (scope: AnyScope): scope is CNAFScope =>
  scope.startsWith('cnaf_');

export const isDGFIPScope = (scope: AnyScope): scope is DGFIPScope =>
  scope.startsWith('dgfip_');

export type AnyScope = CNAFScope | DGFIPScope;

export const unifiedScopesConfiguration = {
  ...cnafScopesConfiguration,
  ...dgfipScopesConfiguration,
};
