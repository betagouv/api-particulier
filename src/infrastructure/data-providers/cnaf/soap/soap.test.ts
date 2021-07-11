import axios from 'axios';
// eslint-disable-next-line node/no-unpublished-import
import MockAdapter from 'axios-mock-adapter';
import {NetworkError} from 'src/domain/data-fetching/errors/network.error';
import {CnafInput} from 'src/domain/data-fetching/data-providers/cnaf/dto';
import {SoapDataProvider} from 'src/infrastructure/data-providers/cnaf/soap';

describe('The soap data provider', () => {
  it('returns a network error when network fails', async () => {
    const dataProvider = new SoapDataProvider();
    const input: CnafInput = {
      numeroAllocataire: '34',
      codePostal: '23',
    };
    const mock = new MockAdapter(axios);

    mock.onPost().networkError();

    await expect(dataProvider.fetch(input)).rejects.toBeInstanceOf(
      NetworkError
    );
  });
});
