export type CNAFInput = {
  numeroAllocataire: string;
  codePostal: string;
};

type Person = {
  nomPrenom: string;
  dateDeNaissance: Date;
  sexe: string;
};

export type CNAFOutput = {
  allocataires: Person[];
  enfants: Person[];
  adresse: {
    identite: string;
    complementIdentiteGeo: string;
    numeroRue: string;
    codePostalVille: string;
    pays: string;
  };
  quotientFamilial: number;
  mois: number;
  annee: number;
};
