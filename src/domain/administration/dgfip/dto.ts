export type DGFIPInput = {
  taxNumber: string;
  taxNoticeNumber: string;
};

type Declarant = {
  nom?: string;
  nomNaissance?: string;
  prenoms?: string;
  dateNaissance?: Date | string;
};

export type DGFIPOutput = {
  declarant1: Declarant;
  declarant2: Declarant;
  dateRecouvrement?: Date;
  dateEtablissement?: Date;
  nombreParts?: number;
  situationFamille?: string;
  nombrePersonnesCharge?: number;
  revenuBrutGlobal?: number | null;
  revenuImposable?: number | null;
  impotRevenuNetAvantCorrections?: number | null;
  montantImpot?: number | null;
  revenuFiscalReference?: number | null;
  foyerFiscal: {
    annee?: number;
    adresse?: string;
  };
  anneeImpots?: number;
  anneeRevenus?: number;
  erreurCorrectif?: string;
  situationPartielle?: string;
};
