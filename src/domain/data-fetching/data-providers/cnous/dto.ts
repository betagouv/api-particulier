import {Brand} from 'src/domain/branded-types';
import {FranceConnectIdentity} from 'src/domain/data-fetching/france-connect.client';

export type CnousId = Brand<string, 'CnousId'>;

export type IneCnousInput = {
  ine: CnousId;
};

export type CiviliteCnousInput = {
  prenoms: string[];
  nom: string;
  dateNaissance: Date;
  sexe: string;
  lieuNaissance: string;
};

export type CnousInput =
  | IneCnousInput
  | CiviliteCnousInput
  | FranceConnectIdentity;

export const isIneInput = (input: CnousInput): input is IneCnousInput => {
  return 'ine' in input;
};

export const isCiviliteInput = (
  input: CnousInput
): input is CiviliteCnousInput => {
  return (
    'prenoms' in input &&
    'nom' in input &&
    'dateNaissance' in input &&
    'sexe' in input &&
    'lieuNaissance' in input
  );
};

export const isFranceConnectIdentityInput = (
  input: CnousInput
): input is FranceConnectIdentity => {
  return (
    'birthdate' in input &&
    'family_name' in input &&
    'given_name' in input &&
    'birthplace' in input &&
    'birthcountry' in input &&
    'gender' in input
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
