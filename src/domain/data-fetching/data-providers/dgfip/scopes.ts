import {ScopesConfiguration} from 'src/domain/data-fetching/scopes-filters/property-based.scopes-filter';
import {DgfipOutput} from './dto';

export type DgfipScope = 'dgfip_avis_imposition' | 'dgfip_adresse';

export const scopesConfiguration: ScopesConfiguration<DgfipScope, DgfipOutput> =
  {
    dgfip_avis_imposition: [
      'anneeImpots',
      'anneeRevenus',
      'dateEtablissement',
      'dateRecouvrement',
      'declarant1',
      'declarant2',
      'erreurCorrectif',
      'foyerFiscal',
      'impotRevenuNetAvantCorrections',
      'montantImpot',
      'nombreParts',
      'nombrePersonnesCharge',
      'revenuBrutGlobal',
      'revenuFiscalReference',
      'revenuImposable',
      'situationFamille',
      'situationPartielle',
    ],
    dgfip_adresse: [
      'declarant1',
      'declarant2',
      'foyerFiscal',
      'anneeImpots',
      'anneeRevenus',
    ],
  };
