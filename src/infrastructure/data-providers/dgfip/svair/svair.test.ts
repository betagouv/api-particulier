/* eslint-disable no-irregular-whitespace */
import {SvairDataProvider} from '.';
import axios from 'axios';
// eslint-disable-next-line node/no-unpublished-import
import MockAdapter from 'axios-mock-adapter';
import {NetworkError} from 'src/domain/data-fetching/errors/network.error';
import {DgfipInput} from 'src/domain/data-fetching/data-providers/dgfip/dto';

describe('Svair data provider', () => {
  const svairDataProvider = new SvairDataProvider();
  const mock = new MockAdapter(axios);
  const expectedViewState = 'the-view-state';
  beforeEach(() => {
    mock
      .onGet()
      .reply(
        200,
        `<input name="javax.faces.ViewState" value="${expectedViewState}">`
      );
  });

  describe('when fetching the state', () => {
    it('loads the JSF view state', async () => {
      const actualViewState = await svairDataProvider.getViewState();
      expect(actualViewState).toEqual(expectedViewState);
    });

    it('throws network error when network fails', async () => {
      mock.onGet().networkError();

      await expect(svairDataProvider.getViewState()).rejects.toBeInstanceOf(
        NetworkError
      );
    });

    it('does not call the network more than once every 5 minutes', async () => {
      mock.resetHistory();
      await svairDataProvider.throttledGetViewState();
      await svairDataProvider.throttledGetViewState();

      expect(mock.history.get).toHaveLength(1);
    });
  });

  describe('when fetching data', () => {
    it('throws a network error when network fails', async () => {
      const input: DgfipInput = {
        taxNoticeNumber: 'yolo',
        taxNumber: 'croute',
      };

      mock
        .onGet()
        .reply(200, '<input name="javax.faces.ViewState" value="croute">');
      mock.onPost().networkError();

      await expect(svairDataProvider.fetch(input)).rejects.toBeInstanceOf(
        NetworkError
      );
    });
  });
});
