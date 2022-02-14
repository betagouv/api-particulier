import {expect} from 'chai';
import {
  CnousId,
  CnousInput,
} from 'src/domain/data-fetching/data-providers/cnous/dto';
import {NotFoundError} from 'src/domain/data-fetching/data-providers/cnous/errors/not-found.error';
import {CnousApiDataProvider} from 'src/infrastructure/data-providers/cnous/cnous-api.data-provider';

describe('The CNOUS api data provider', () => {
  const dataProvider = new CnousApiDataProvider();

  it('returns data when correct input is provided', async () => {
    const input: CnousInput = {
      ine: process.env.TEST_CNOUS_INE as CnousId,
    };

    const output = await dataProvider.fetch(input);
    expect(output.nom).to.be.a('string');
  });

  it('returns a domain error when no student is found', async () => {
    const input: CnousInput = {
      ine: 'yolo123' as CnousId,
    };
    await expect(dataProvider.fetch(input)).to.have.rejectedWith(NotFoundError);
  }).timeout(10000);
});
