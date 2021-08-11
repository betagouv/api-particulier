import {expect} from 'chai';
import {Inscription} from 'src/domain/data-fetching/data-providers/mesri/dto';
import {MesriScopesFilter} from 'src/domain/data-fetching/scopes-filters/mesri.scopes-filter';

describe('The mesri scopes filter', () => {
  const mesriScopesFilter = new MesriScopesFilter();
  const inscriptions = <Inscription[]>[
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
  ];

  it('filters on admission', () => {
    const result = mesriScopesFilter.filterInsriptions(
      ['mesri_admission', 'mesri_etablissements'],
      inscriptions
    );

    expect(result).to.have.length(1);
    expect(result[0].codeCommune).to.equal('communeAdmis');
  });

  it('filters on etudiant', () => {
    const result = mesriScopesFilter.filterInsriptions(
      ['mesri_inscription_etudiant', 'mesri_etablissements'],
      inscriptions
    );

    expect(result).to.have.length(1);
    expect(result[0].codeCommune).to.equal('communeInscritInitial');
  });

  it('filters on autre', () => {
    const result = mesriScopesFilter.filterInsriptions(
      ['mesri_inscription_autre', 'mesri_etablissements'],
      inscriptions
    );

    expect(result).to.have.length(1);
    expect(result[0].codeCommune).to.equal('communeInscritContinu');
  });

  it('filters on etablissement', () => {
    const result = mesriScopesFilter.filterInsriptions(
      ['mesri_inscription_autre'],
      inscriptions
    );

    expect(result).to.have.length(1);
    expect(result[0].codeCommune).to.be.undefined;
  });
});
