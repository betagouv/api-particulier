export type CnafInput = {
  numeroAllocataire: string;
  codePostal: string;
};

export type Person = {
  nomPrenom: string;
  dateDeNaissance: Date;
  sexe: string;
};

export type CnafOutput = {
  allocataires: Person[];
  enfants: Person[];
  adresse: {
    identite?: string;
    complementIdentite?: string;
    complementIdentiteGeo?: string;
    numeroRue?: string;
    lieuDit?: string;
    codePostalVille?: string;
    pays?: string;
  };
  quotientFamilial: number | null;
  mois: number | null;
  annee: number | null;
};
