import {expect} from 'chai';
import {MesriOutput} from 'src/domain/data-fetching/data-providers/mesri/dto';
import {scopesConfiguration} from 'src/domain/data-fetching/data-providers/mesri/scopes';
import {MesriScopesFilter} from 'src/domain/data-fetching/scopes-filters/mesri.scopes-filter';
import {PropertyBasedScopesFilter} from 'src/domain/data-fetching/scopes-filters/property-based.scopes-filter';

describe('The mesri scopes filter', () => {
  const mesriScopesFilter = new MesriScopesFilter(
    new PropertyBasedScopesFilter(scopesConfiguration)
  );
  const input: Partial<MesriOutput> = {
    inscriptions: [
      {
        codeCommune: 'communeAdmis',
        dateDebutInscription: new Date(),
        dateFinInscription: new Date(),
        etablissement: {
          uai: 'uai',
          nom: 'etablissement',
        },
        statut: 'admis',
        regime: 'formation continue',
      },
      {
        codeCommune: 'communeInscritContinu',
        dateDebutInscription: new Date(),
        dateFinInscription: new Date(),
        etablissement: {
          uai: 'uai',
          nom: 'etablissement',
        },
        statut: 'inscrit',
        regime: 'formation continue',
      },
      {
        codeCommune: 'communeInscritInitial',
        dateDebutInscription: new Date(),
        dateFinInscription: new Date(),
        etablissement: {
          uai: 'uai',
          nom: 'etablissement',
        },
        statut: 'inscrit',
        regime: 'formation initiale',
      },
    ],
  };

  it('filters on admission', () => {
    const result = mesriScopesFilter.filter(
      ['mesri_admission', 'mesri_etablissements'],
      input
    );

    expect(result.inscriptions).to.have.length(1);
    expect(result.inscriptions[0].codeCommune).to.equal('communeAdmis');
  });

  it('filters on etudiant', () => {
    const result = mesriScopesFilter.filter(
      ['mesri_inscription_etudiant', 'mesri_etablissements'],
      input
    );

    expect(result.inscriptions).to.have.length(1);
    expect(result.inscriptions[0].codeCommune).to.equal(
      'communeInscritInitial'
    );
  });

  it('filters on autre', () => {
    const result = mesriScopesFilter.filter(
      ['mesri_inscription_autre', 'mesri_etablissements'],
      input
    );

    expect(result.inscriptions).to.have.length(1);
    expect(result.inscriptions[0].codeCommune).to.equal(
      'communeInscritContinu'
    );
  });

  it('filters on etablissement', () => {
    const result = mesriScopesFilter.filter(['mesri_inscription_autre'], input);

    expect(result.inscriptions).to.have.length(1);
    expect(result.inscriptions[0].codeCommune).to.be.undefined;
  });
});
