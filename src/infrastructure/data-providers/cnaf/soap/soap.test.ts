import axios from 'axios';
// eslint-disable-next-line node/no-unpublished-import
import MockAdapter from 'axios-mock-adapter';
import {NetworkError} from 'src/domain/gateway/errors/network.error';
import {CNAFInput} from 'src/domain/gateway/cnaf/dto';
import {SoapDataProvider} from 'src/infrastructure/data-providers/cnaf/soap';

describe('The soap data provider', () => {
  it('returns a network error when network fails', async () => {
    const dataProvider = new SoapDataProvider();
    const input: CNAFInput = {
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
