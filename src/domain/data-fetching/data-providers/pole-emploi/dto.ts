import {Brand} from 'src/domain/branded-types';

export type PoleEmploiId = Brand<string, 'PoleEmploiId'>;

export type PoleEmploiInput = {
  id: PoleEmploiId;
};

export type PoleEmploiOutput = {
  identifiant: PoleEmploiId;
  adresse: {
    INSEECommune: string;
    codePostal: string;
    ligneNom: string;
    ligneVoie: string;
    localite: string;
    ligneComplementAdresse: string;
    ligneComplementDestinataire: string;
    ligneComplementDistribution: string;
  };
  codeCategorieInscription?: number;
  libelleCategorieInscription: string;
  civilite: string;
  codeCertificationCNAV: string;
  dateCessationInscription?: Date;
  dateInscription?: Date;
  dateNaissance?: Date;
  email: string;
  nom: string;
  nomUsage: string;
  sexe: string;
  prenom: string;
  telephone: string;
  telephone2: string;
};

export type PoleEmploiMetadata = {
  caller: {
    id: string;
    name: string;
  };
};
