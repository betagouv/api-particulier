import {expect} from 'chai';
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
      montantImpot: undefined,
    };

    const output = dgfipDataPresenter.presentData(input, false);

    expect(output.montantImpot).to.be.null;
  });

  it('sets null values when needed', () => {
    const input: Partial<DgfipOutput> = {
      revenuFiscalReference: undefined,
    };

    const output = dgfipDataPresenter.presentData(input, true);

    expect(output.revenuFiscalReference).to.be.null;
  });

  it('formats dates', () => {
    const input: Partial<DgfipOutput> = {
      dateEtablissement: new Date('2020-01-31'),
    };

    const output = dgfipDataPresenter.presentData(input, true);

    expect(output.dateEtablissement).to.equal('31/01/2020');
    expect(output.dateRecouvrement).to.be.undefined;
  });
});
