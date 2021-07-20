export type CnafScope = keyof typeof scopesConfiguration;

export const scopesConfiguration = {
  cnaf_adresse: ['adresse'],
  cnaf_allocataires: ['allocataires'],
  cnaf_enfants: ['enfants'],
  cnaf_quotient_familial: ['quotientFamilial', 'mois', 'annee'],
};
