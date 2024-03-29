/* eslint-disable no-irregular-whitespace */
import {SvairDataProvider} from 'src/infrastructure/data-providers/dgfip/svair';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {NetworkError} from 'src/domain/data-fetching/errors/network.error';
import {DgfipInput} from 'src/domain/data-fetching/data-providers/dgfip/dto';
import {expect} from 'chai';

describe('Svair data provider', () => {
  const svairDataProvider = new SvairDataProvider();
  const expectedViewState = 'the-view-state';
  let mock: MockAdapter;
  after(() => {
    svairDataProvider.throttledGetViewState.cancel();
  });

  beforeEach(() => {
    mock = new MockAdapter(axios);
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
      expect(actualViewState).to.equal(expectedViewState);
    });

    it('throws network error when network fails', async () => {
      mock.onGet().networkError();

      expect(svairDataProvider.getViewState()).to.be.rejectedWith(NetworkError);
    });

    it('does not call the network more than once every 5 minutes', async () => {
      mock.resetHistory();
      await svairDataProvider.throttledGetViewState();
      await svairDataProvider.throttledGetViewState();

      expect(mock.history.get).to.have.length(1);
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

      expect(svairDataProvider.fetch(input)).to.be.rejectedWith(NetworkError);
    });
  });
});
