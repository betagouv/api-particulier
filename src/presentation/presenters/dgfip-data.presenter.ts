import {defaults, pick} from 'lodash';
import {DgfipOutput} from 'src/domain/data-fetching/data-providers/dgfip/dto';

export class DgfipDataPresenter {
  presentData(input: Partial<DgfipOutput>, withNulls: boolean) {
    const mask = {
      declarant1: {
        nom: '',
        nomNaissance: '',
        prenoms: '',
        dateNaissance: '',
      },
      declarant2: {
        nom: '',
        nomNaissance: '',
        prenoms: '',
        dateNaissance: '',
      },
      foyerFiscal: {
        adresse: '',
      },
      dateRecouvrement: '',
      dateEtablissement: '',
      nombreParts: '',
      situationFamille: '',
      nombrePersonnesCharge: 0,
      revenuBrutGlobal: withNulls ? null : undefined,
      revenuImposable: withNulls ? null : undefined,
      impotRevenuNetAvantCorrections: withNulls ? null : undefined,
      montantImpot: withNulls ? null : undefined,
      revenuFiscalReference: withNulls ? null : undefined,
    };

    return defaults(input, pick(mask, Object.keys(input)));
  }
}
