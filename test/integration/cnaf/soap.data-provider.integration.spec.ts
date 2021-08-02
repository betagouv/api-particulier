// eslint-disable-next-line node/no-unpublished-import
import {expect} from 'chai';
import {SoapDataProvider} from 'src/infrastructure/data-providers/cnaf/soap';
import {CnafInput} from 'src/domain/data-fetching/data-providers/cnaf/dto';

describe('The soap data provider', () => {
  const dataProvider = new SoapDataProvider();

  it('returns data when correct input is provided', async () => {
    const input: CnafInput = {
      numeroAllocataire: process.env.TEST_NUMERO_ALLOCATAIRE!,
      codePostal: process.env.TEST_CODE_POSTAL!,
    };

    const output = await dataProvider.fetch(input);

    expect(output.quotientFamilial).to.be.a('number');
  });
});
