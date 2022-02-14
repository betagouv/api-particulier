import {scopesConfiguration as poleEmploiScopesConfiguration} from 'src/domain/data-fetching/data-providers/pole-emploi/scopes';
import {scopesConfiguration as cnafScopesConfiguration} from './data-fetching/data-providers/cnaf/scopes';
import {scopesConfiguration as dgfipScopesConfiguration} from './data-fetching/data-providers/dgfip/scopes';
import {scopesConfiguration as mesriScopesConfiguration} from './data-fetching/data-providers/mesri/scopes';
import {scopesConfiguration as cnousScopesConfiguration} from './data-fetching/data-providers/cnous/scopes';

export const unifiedScopesConfiguration = {
  ...cnafScopesConfiguration,
  ...dgfipScopesConfiguration,
  ...poleEmploiScopesConfiguration,
  ...mesriScopesConfiguration,
  ...cnousScopesConfiguration,
};

export type Scope = keyof typeof unifiedScopesConfiguration;
