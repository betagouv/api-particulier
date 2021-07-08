import * as dotenv from 'dotenv';
import {SoapDataProvider} from 'src/infrastructure/data-providers/cnaf/soap';
import {CNAFInput} from 'src/domain/administration/cnaf/dto';

dotenv.config();

it('The soap data provider', async () => {
  const dataProvider = new SoapDataProvider();

  const input: CNAFInput = {
    numeroAllocataire: process.env.TEST_NUMERO_ALLOCATAIRE!,
    codePostal: process.env.TEST_CODE_POSTAL!,
  };

  const output = await dataProvider.fetch(input);

  expect(output.quotientFamilial).toBeDefined();
});
