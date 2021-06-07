import {SvairDataProvider} from './svair.data-provider';

describe('Svair data provider', () => {
  const svairDataProvider = new SvairDataProvider();

  it('loads the JSF view state', async () => {
    const viewState = await svairDataProvider.getViewState();
    expect(viewState).toMatchInlineSnapshot(
      '"RxJe/1JKTJSr3aiM3H9DqZq0DrwqEXsY7Rw4eLRgEBsCF1IALJGqVgWTaQkiKbbdcGDWW774BWUCa/+j2CDznhw1/3bxJteY6ZCui66yNevhkej4xuyrFMte5KQnKORt9JZrOQ=="'
    );
  });
});
