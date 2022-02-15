import {expect} from 'chai';
import {
  CnousId,
  CnousInput,
} from 'src/domain/data-fetching/data-providers/cnous/dto';
import {NotFoundError} from 'src/domain/data-fetching/data-providers/cnous/errors/not-found.error';
import {CnousApiDataProvider} from 'src/infrastructure/data-providers/cnous/cnous-api.data-provider';

describe('The CNOUS api data provider', () => {
  const dataProvider = new CnousApiDataProvider();

  it('returns data when an ine input is provided', async () => {
    const input: CnousInput = {
      ine: process.env.TEST_CNOUS_INE as CnousId,
    };

    const output = await dataProvider.fetch(input);
    expect(output.nom).to.be.a('string');
  });

  it('returns data when a civility input is provided', async () => {
    const input: CnousInput = {
      prenoms: process.env.TEST_CNOUS_PRENOMS!.split(' '),
      nom: process.env.TEST_CNOUS_NOM!,
      dateNaissance: new Date(process.env.TEST_CNOUS_DATE_NAISSANCE!),
      sexe: process.env.TEST_CNOUS_SEXE!,
      lieuNaissance: process.env.TEST_CNOUS_LIEU_NAISSANCE!,
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
