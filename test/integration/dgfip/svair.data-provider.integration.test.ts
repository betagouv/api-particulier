import {expect} from 'chai';
import {SvairDataProvider} from 'src/infrastructure/data-providers/dgfip/svair';
import {DgfipInput} from 'src/domain/data-fetching/data-providers/dgfip/dto';

describe('The Svair data provider', () => {
  const dataProvider = new SvairDataProvider();

  after(() => {
    dataProvider.throttledGetViewState.cancel();
  });

  it('returns data when correct input is provided', async () => {
    const input: DgfipInput = {
      taxNumber: process.env.TEST_TAX_NUMBER!,
      taxNoticeNumber: process.env.TEST_TAX_NOTICE_NUMBER!,
    };

    const output = await dataProvider.fetch(input);

    expect(output.anneeImpots).to.be.a('number');
    expect(output.anneeRevenus).to.be.a('number');
    expect(output.dateEtablissement).to.be.a('date');
    expect(output.declarant1.nom).to.be.a('string');
    expect(output.declarant1.dateNaissance).to.be.a('date');
  });
});
