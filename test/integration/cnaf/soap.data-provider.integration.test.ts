import * as dotenv from 'dotenv';
import {SoapDataProvider} from 'src/infrastructure/data-providers/cnaf/soap';
import {CnafInput} from 'src/domain/gateway/data-providers/cnaf/dto';

dotenv.config();

it('The soap data provider', async () => {
  const dataProvider = new SoapDataProvider();

  const input: CnafInput = {
    numeroAllocataire: process.env.TEST_NUMERO_ALLOCATAIRE!,
    codePostal: process.env.TEST_CODE_POSTAL!,
  };

  const output = await dataProvider.fetch(input);

  expect(output.quotientFamilial).toBeDefined();
});
