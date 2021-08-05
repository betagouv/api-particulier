export type DgfipInput = {
  taxNumber: string;
  taxNoticeNumber: string;
};

type Declarant = {
  nom?: string;
  nomNaissance?: string;
  prenoms?: string;
  dateNaissance?: Date | string;
};

export type DgfipOutput = {
  declarant1: Declarant;
  declarant2: Declarant;
  dateRecouvrement?: Date | '-' | string;
  dateEtablissement?: Date | string;
  nombreParts?: number;
  situationFamille?: string;
  nombrePersonnesCharge?: number;
  revenuBrutGlobal?: number;
  revenuImposable?: number;
  impotRevenuNetAvantCorrections?: number | null;
  montantImpot?: number | null;
  revenuFiscalReference?: number;
  foyerFiscal: {
    annee?: number;
    adresse?: string;
  };
  anneeImpots?: number;
  anneeRevenus?: number;
  erreurCorrectif?: string;
  situationPartielle?: string;
};
