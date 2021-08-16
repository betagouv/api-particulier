import {expect} from 'chai';
import {
  MesriId,
  MesriInput,
} from 'src/domain/data-fetching/data-providers/mesri/dto';
import {MesriSupdataDataProvider} from 'src/infrastructure/data-providers/mesri/mesri-supdata.data-provider';

describe('The Supdata Mesri data provider', () => {
  const dataProvider = new MesriSupdataDataProvider();

  it('returns data when input is a correct ine', async () => {
    const input: MesriInput = {
      ine: <MesriId>process.env.TEST_MESRI_INE,
    };

    const output = await dataProvider.fetch(input, {
      caller: 'Intégration continue API Particulier',
    });

    expect(output.ine).to.equal(process.env.TEST_MESRI_INE);
  });

  it('returns data when input is a correct civilite', async () => {
    const input: MesriInput = {
      nomFamille: process.env.TEST_MESRI_NOM!,
      prenom: process.env.TEST_MESRI_PRENOM!,
      sexe: process.env.TEST_MESRI_SEXE!,
      dateNaissance: new Date(process.env.TEST_MESRI_DATE_NAISSANCE!),
      lieuNaissance: process.env.TEST_MESRI_LIEU_NAISSANCE!,
    };

    const output = await dataProvider.fetch(input, {
      caller: 'Intégration continue API Particulier',
    });

    expect(output.ine).to.be.undefined;
    expect(output.inscriptions).to.be.an('array');
  });
});
