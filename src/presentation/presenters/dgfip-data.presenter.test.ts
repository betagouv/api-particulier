import {DgfipOutput} from 'src/domain/data-fetching/data-providers/dgfip/dto';
import {DgfipDataPresenter} from 'src/presentation/presenters/dgfip-data.presenter';

describe('The DGFIP data presenter', () => {
  const dgfipDataPresenter = new DgfipDataPresenter();
  it('replaces undefined values with empty strings', () => {
    const input: Partial<DgfipOutput> = {
      declarant1: {
        nom: 'Croute',
        prenoms: 'Jean',
        dateNaissance: new Date('1991-05-03'),
      },
      anneeImpots: 2020,
      anneeRevenus: 2021,
      nombreParts: 2,
    };

    const output = dgfipDataPresenter.presentData(input, false);

    expect(output.montantImpot).toBeUndefined();
  });

  it('sets null values when needed', () => {
    const input: Partial<DgfipOutput> = {
      montantImpot: undefined,
    };

    const output = dgfipDataPresenter.presentData(input, true);

    expect(output.montantImpot).toBeNull();
  });
});
