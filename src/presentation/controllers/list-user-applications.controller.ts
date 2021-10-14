import {Request, Response} from 'express';
import {applicationRepository} from 'src/infrastructure/service-container';

export const scopesConfiguration = {
  'DGFIP - État civil - déclarant 1': {
    dgfip_declarant1_nom: 'Nom',
    dgfip_declarant1_nom_naissance: 'Nom de naissance',
    dgfip_declarant1_prenoms: 'Prénom(s)',
    dgfip_declarant1_date_naissance: 'Date de naissancee',
  },
  'DGFIP - État civil - déclarant 2': {
    dgfip_declarant2_nom: 'Nom',
    dgfip_declarant2_nom_naissance: 'Nom de naissance',
    dgfip_declarant2_prenoms: 'Prénom(s)',
    dgfip_declarant2_date_naissance: 'Date de naissancee',
  },
  'DGFIP - Échéances de l’avis d’imposition': {
    dgfip_date_recouvrement: 'Date de recouvrement',
    dgfip_date_etablissement: "Date d'établissement",
  },
  'DGFIP - Situation du foyer fiscal': {
    dgfip_adresse_fiscale_taxation: 'Adresse',
    dgfip_adresse_fiscale_annee: 'Année de déclaration',
    dgfip_nombre_parts: 'Nombre de parts',
    dgfip_nombre_personnes_a_charge: 'Nombre de personnes à charge',
    dgfip_situation_familiale: 'Situation de famille',
  },
  'DGFIP - Agrégats fiscaux': {
    dgfip_revenu_brut_global: 'Revenu brut global',
    dgfip_revenu_imposable: 'Revenu imposable',
    dgfip_impot_revenu_net_avant_corrections:
      'Impôt sur le revenu net avant corrections',
    dgfip_montant_impot: "Montant de l'impôt",
    dgfip_revenu_fiscal_reference: 'Revenu fiscal de référence',
    dgfip_annee_impot: "Année de l'impôt",
    dgfip_annee_revenus: 'Année des revenus',
  },
  'DGFIP - Compléments': {
    dgfip_erreur_correctif: 'Erreur correctif',
    dgfip_situation_partielle: 'Situation partielle',
  },
  CNAF: {
    cnaf_quotient_familial: 'Quotient familial',
    cnaf_allocataires: 'Allocataires',
    cnaf_enfants: 'Enfants',
    cnaf_adresse: 'Adresse',
  },
  'Pôle Emploi': {
    pole_emploi_identite: 'Identité',
    pole_emploi_contact: 'Données de contact',
    pole_emploi_adresse: 'Adresse',
    pole_emploi_inscription: 'Inscription',
  },
  MESRI: {
    mesri_identifiant: 'INE',
    mesri_identite: 'Identité',
    mesri_inscription_etudiant: 'Inscriptions en formation initiale',
    mesri_inscription_autre: 'Inscriptions en formation continue',
    mesri_admission: 'Admissions',
    mesri_etablissements: 'Établissements',
  },
};

export const listUserApplications = async (req: Request, res: Response) => {
  const applications = await applicationRepository.findAllByUserEmail(
    req.user!.email
  );

  res.render('index', {applications, user: req.user, scopesConfiguration});
};
