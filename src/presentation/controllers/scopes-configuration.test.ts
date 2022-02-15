import {expect} from 'chai';
import {chain, keys} from 'lodash';
import {scopesConfiguration as apiScopesConfiguration} from 'src/domain/scopes';
import {scopesConfiguration as portalScopesConfiguration} from 'src/presentation/controllers/list-user-applications.controller';

describe('The frontend scopes configuration', () => {
  it('should match the API scopes', () => {
    const flattenedScopesConfiguration = chain(portalScopesConfiguration)
      .values()
      .map(values => keys(values))
      .flatten()
      .value();
    const allScopes = keys(apiScopesConfiguration);
    expect(flattenedScopesConfiguration).to.have.members(allScopes);
  });
});
