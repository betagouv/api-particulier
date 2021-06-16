/* eslint-disable no-irregular-whitespace */
import {SvairDataProvider} from '.';
import axios from 'axios';
// eslint-disable-next-line node/no-unpublished-import
import MockAdapter from 'axios-mock-adapter';

describe('Svair data provider', () => {
  const svairDataProvider = new SvairDataProvider();
  const mock = new MockAdapter(axios);
  const expectedViewState = 'the-view-state';
  mock
    .onGet()
    .reply(
      200,
      `<input name="javax.faces.ViewState" value="${expectedViewState}">`
    );

  it('loads the JSF view state', async () => {
    const actualViewState = await svairDataProvider.getViewState();
    expect(actualViewState).toEqual(expectedViewState);
  });
});
