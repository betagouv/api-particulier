import {
  PropertyBasedScopesFilter,
  ScopesConfiguration,
} from './property-based.scopes-filter';

describe('The generic property-based scopes filter', () => {
  type TestScope = 'yolo' | 'croute';
  const payload = {
    name: 'Jean',
    surname: 'Croute',
  };
  const scopesConfiguration: ScopesConfiguration<TestScope, typeof payload> = {
    yolo: ['name'],
    croute: ['surname'],
  };
  const {filter} = new PropertyBasedScopesFilter(scopesConfiguration);

  it('filters provided data based on scopes configuration', () => {
    expect(filter(['croute'], payload)).toEqual({
      surname: payload.surname,
    });
  });

  it('returns an empty object when no scope is provided', () => {
    expect(filter([], payload)).toEqual({});
  });
});
