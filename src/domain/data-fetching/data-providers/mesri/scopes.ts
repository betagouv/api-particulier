export type MesriScope = keyof typeof scopesConfiguration;

export const scopesConfiguration = {
  mesri_identifiant: ['ine'],
  mesri_identite: ['nom', 'prenom', 'dateNaissance'],
  mesri_inscription_etudiant: [
    'inscriptions.statut',
    'inscriptions.regime',
    'inscriptions.dateDebutInscription',
    'inscriptions.dateFinInscription',
  ],
  mesri_inscription_autre: [
    'inscriptions.statut',
    'inscriptions.regime',
    'inscriptions.dateDebutInscription',
    'inscriptions.dateFinInscription',
  ],
  mesri_admission: [
    'inscriptions.statut',
    'inscriptions.regime',
    'inscriptions.dateDebutInscription',
    'inscriptions.dateFinInscription',
  ],
  mesri_etablissements: [
    'inscriptions.codeCommune',
    'inscriptions.etablissement.uai',
    'inscriptions.etablissement.nom',
  ],
};
