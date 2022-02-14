import {Brand} from 'src/domain/branded-types';

export type CnousId = Brand<string, 'CnousId'>;

export type IneCnousInput = {
  ine: CnousId;
};

export type CiviliteCnousInput = {
  prenoms: string;
  nomFamille: string;
  dateNaissance: Date;
  sexe: string;
  lieuNaissance: string;
};

export type CnousInput = IneCnousInput | CiviliteCnousInput;

export const isIneInput = (input: CnousInput): input is IneCnousInput => {
  return 'ine' in input;
};

export const isCiviliteInput = (
  input: CnousInput
): input is CiviliteCnousInput => {
  return (
    'prenoms' in input &&
    'nomFamille' in input &&
    'dateNaissance' in input &&
    'sexe' in input &&
    'lieuNaissance' in input
  );
};

export type CnousOutput = {
  nom: string;
  prenom: string;
  prenom2: string;
  dateNaissance: Date;
  lieuNaissance: string;
  sexe: string;
  boursier: boolean;
  echelonBourse: string;
  email: string;
  dateDeRentree: Date;
  dureeVersement: number;
  statut: number;
  statutLibelle: string;
  villeEtudes: string;
  etablissement: string;
};
