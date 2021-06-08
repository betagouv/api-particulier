import {SvairDataProvider} from './svair.data-provider';
import axios from 'axios';
// eslint-disable-next-line node/no-unpublished-import
import MockAdapter from 'axios-mock-adapter';

describe('Svair data provider', () => {
  const svairDataProvider = new SvairDataProvider();
  const mock = new MockAdapter(axios);

  it('loads the JSF view state', async () => {
    const expectedViewState = 'the-view-state';
    mock
      .onGet()
      .reply(
        200,
        `<input name="javax.faces.ViewState" value="${expectedViewState}">`
      );
    const actualViewState = await svairDataProvider.getViewState();
    expect(actualViewState).toEqual(expectedViewState);
  });
});
