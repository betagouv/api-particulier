import {expect} from 'chai';
import {chain, keys} from 'lodash';
import {unifiedScopesConfiguration} from 'src/domain/scopes';
import {scopesConfiguration} from 'src/presentation/controllers/list-user-applications.controller';

describe('The frontend scopes configuration', () => {
  it('should match the API scopes', () => {
    const flattenedScopesConfiguration = chain(scopesConfiguration)
      .values()
      .map(values => keys(values))
      .flatten()
      .value();
    const allScopes = keys(unifiedScopesConfiguration);
    expect(flattenedScopesConfiguration).to.have.members(allScopes);
  });
});
