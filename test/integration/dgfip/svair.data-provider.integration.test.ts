import {SvairDataProvider} from '../../../src/infrastructure/data-providers/dgfip/svair';
import {DGFIPInput} from '../../../src/domain/dgfip/dto';
import * as dotenv from 'dotenv';

dotenv.config();

describe('The Svair data provider', () => {
  const dataProvider = new SvairDataProvider();

  it('returns data when correct input is provided', async () => {
    const input: DGFIPInput = {
      taxNumber: process.env.TEST_TAX_NUMBER!,
      taxNoticeNumber: process.env.TEST_TAX_NOTICE_NUMBER!,
    };

    const output = await dataProvider.fetch(input);

    expect(output.anneeImpots).toBeDefined();
    expect(output.anneeRevenus).toBeDefined();
    expect(output.dateEtablissement).toBeInstanceOf(Date);
    expect(output.declarant1.nom).toBeDefined();
    expect(output.declarant1.dateNaissance).toBeDefined();
  });
});
