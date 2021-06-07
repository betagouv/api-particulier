import {SvairDataProvider} from './svair.data-provider';

describe('Svair data provider', () => {
  it('it implements the interface', () => {
    const svairDataProvider = new SvairDataProvider();
    expect(svairDataProvider.fetch).toThrow();
  });
});
