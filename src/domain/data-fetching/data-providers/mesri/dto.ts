import {Brand} from 'src/domain/branded-types';

export type MesriId = Brand<string, 'MesriId'>;

export type IneMesriInput = {
  ine: MesriId;
};

export type CiviliteMesriInput = {
  prenom: string;
  nomFamille: string;
  dateNaissance: Date;
  sexe: string;
  lieuNaissance: string;
};

export type MesriInput = IneMesriInput | CiviliteMesriInput;

export type MesriMetadata = {
  caller: string;
};

export const isIneInput = (input: MesriInput): input is IneMesriInput => {
  return 'ine' in input;
};
export const isCiviliteInput = (
  input: MesriInput
): input is CiviliteMesriInput => {
  return (
    'prenom' in input &&
    'nomFamille' in input &&
    'dateNaissance' in input &&
    'sexe' in input &&
    'lieuNaissance' in input
  );
};

export type Inscription = {
  dateDebutInscription: Date;
  dateFinInscription: Date;
  statut: 'admis' | 'inscrit';
  regime: 'formation initiale' | 'formation continue';
  codeCommune: string;
  etablissement: {
    uai: string;
    nom: string;
  };
};

export type MesriOutput = {
  ine: MesriId;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  inscriptions: Inscription[];
};
