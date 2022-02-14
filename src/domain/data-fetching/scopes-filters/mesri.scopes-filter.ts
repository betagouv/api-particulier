import {isEmpty} from 'lodash';
import {Inscription} from 'src/domain/data-fetching/data-providers/mesri/dto';
import {NoEnrollmentError} from 'src/domain/data-fetching/data-providers/mesri/errors/no-enrollment.error';
import {Scope} from 'src/domain/scopes';

export class MesriScopesFilter {
  filterInsriptions(scopes: Scope[], inscriptions: Inscription[] = []) {
    const partialInscriptions = (inscriptions
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

    if (partialInscriptions.length === 0) {
      throw new NoEnrollmentError();
    }

    return partialInscriptions;
  }
}
