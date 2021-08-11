import {isEmpty} from 'lodash';
import {
  Inscription,
  MesriOutput,
} from 'src/domain/data-fetching/data-providers/mesri/dto';
import {MesriScope} from 'src/domain/data-fetching/data-providers/mesri/scopes';
import {PropertyBasedScopesFilter} from 'src/domain/data-fetching/scopes-filters/property-based.scopes-filter';

export class MesriScopesFilter {
  constructor(
    private readonly propertyBasedScopesFilter: PropertyBasedScopesFilter<
      MesriScope,
      MesriOutput
    >
  ) {}

  filter(scopes: MesriScope[], input: Partial<MesriOutput>) {
    const partialResponse = this.propertyBasedScopesFilter.filter(
      scopes,
      input
    );

    const partialInscriptions = (input.inscriptions
      ?.map(inscription => {
        let result: object = {};
        if (
          scopes.includes('mesri_inscription_etudiant') &&
          inscription.statut === 'inscrit' &&
          inscription.regime === 'formation initiale'
        ) {
          result = {
            ...result,
            statut: 'inscrit',
            regime: 'formation initiale',
            dateDebutInscription: inscription.dateDebutInscription,
            dateFinInscription: inscription.dateFinInscription,
          };
          if (scopes.includes('mesri_etablissements')) {
            result = {
              ...result,
              etablissement: inscription.etablissement,
              codeCommune: inscription.codeCommune,
            };
          }
        }
        if (
          scopes.includes('mesri_inscription_autre') &&
          inscription.statut === 'inscrit' &&
          inscription.regime === 'formation continue'
        ) {
          result = {
            ...result,
            statut: 'inscrit',
            regime: 'formation continue',
            dateDebutInscription: inscription.dateDebutInscription,
            dateFinInscription: inscription.dateFinInscription,
          };
          if (scopes.includes('mesri_etablissements')) {
            result = {
              ...result,
              etablissement: inscription.etablissement,
              codeCommune: inscription.codeCommune,
            };
          }
        }
        if (
          scopes.includes('mesri_admission') &&
          inscription.statut === 'admis'
        ) {
          result = {
            ...result,
            statut: 'admis',
            regime: inscription.regime,
            dateDebutAdmission: inscription.dateDebutInscription,
            dateFinAdmission: inscription.dateFinInscription,
          };
          if (scopes.includes('mesri_etablissements')) {
            result = {
              ...result,
              etablissement: inscription.etablissement,
              codeCommune: inscription.codeCommune,
            };
          }
        }
        return result;
      })
      .filter(partial => !isEmpty(partial)) ?? []) as Partial<Inscription>[];

    return {
      ...partialResponse,
      inscriptions: partialInscriptions,
    };
  }
}
