export type DGFIPInput = {
  taxNumber: string;
  taxNoticeNumber: string;
};

type Declarant = {
  nom: string;
  nomNaissance: string;
  prenoms: string;
  dateNaissance: Date;
};

export type DGFIPOutput = {
  declarant1: Declarant;
  declarant2?: Declarant;
  dateRecouvrement: Date;
  dateEtablissement: Date;
  nombreParts: number;
  situationFamille: string;
  nombrePersonnesCharge: number;
  revenuBrutGlobal: number;
  revenuImposable: number;
  impotRevenuNetAvantCorrections: number;
  montantImpot: number;
  revenuFiscalReference: number;
  foyerFiscal: {
    annee: number;
    adresse: string;
  };
  anneeImpots: number;
  anneeRevenus: number;
  erreurCorrectif: string;
  situationPartielle: string;
};
