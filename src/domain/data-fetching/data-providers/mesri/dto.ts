import {Brand} from 'src/domain/branded-types';

export type MesriId = Brand<string, 'MesriIr'>;

export type MesriInput = {
  ine: MesriId;
};

export type MesriOutput = {
  ine: MesriId;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  inscriptions: {
    dateDebutInscription: Date;
    dateFinInscription: Date;
    statut: 'admis' | 'inscrit';
    regime: 'formation initiale' | 'formation continue';
    codeCommune: string;
    etablissement: {
      uai: string;
      nom: string;
    };
  }[];
};
