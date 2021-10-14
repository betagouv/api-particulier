import {expect} from 'chai';
import {
  PoleEmploiId,
  PoleEmploiInput,
} from 'src/domain/data-fetching/data-providers/pole-emploi/dto';
import {PoleEmploiApiDataProvider} from 'src/infrastructure/data-providers/pole-emploi/pole-emploi-api.data-provider';

describe('The pole emploi api data provider', () => {
  const dataProvider = new PoleEmploiApiDataProvider();
  const caller = {
    id: 'XXX',
    name: 'Intégration continue API Particulier',
  };

  it('returns data when correct input is provided', async () => {
    const input: PoleEmploiInput = {
      id: process.env.TEST_POLE_EMPLOI_ID as PoleEmploiId,
    };

    const output = await dataProvider.fetch(input, {
      caller,
    });
    expect(output.nom).to.be.a('string');
  });
});
