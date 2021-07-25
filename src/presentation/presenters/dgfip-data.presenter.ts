import {format} from 'date-fns';
import {get, has, identity, set} from 'lodash';
import {DgfipOutput} from 'src/domain/data-fetching/data-providers/dgfip/dto';

const formatDate = (date?: Date) => {
  if (!date) {
    return '';
  }
  return format(date, 'dd/MM/yyyy');
};

const formatUndefined = (value?: unknown) => (value === undefined ? '' : value);
const formatNull = (value?: unknown) => (value === undefined ? null : value);
const formatYears = (value?: number) =>
  value === undefined ? '' : value.toString();
const formatDateOrMissing = (date?: Date | '-') => {
  if (date === '-') {
    return '-';
  }
  return formatDate(date);
};

export class DgfipDataPresenter {
  presentData(input: Partial<DgfipOutput>, withNulls: boolean) {
    const config = {
      'declarant1.nom': formatUndefined,
      'declarant1.nomNaissance': formatUndefined,
      'declarant1.prenoms': formatUndefined,
      'declarant1.dateNaissance': formatDate,
      'declarant2.nom': formatUndefined,
      'declarant2.nomNaissance': formatUndefined,
      'declarant2.prenoms': formatUndefined,
      'declarant2.dateNaissance': formatDate,
      'foyerFiscal.adresse': formatUndefined,
      'foyerFiscal.annee': identity,
      dateRecouvrement: formatDateOrMissing,
      dateEtablissement: formatDate,
      nombreParts: formatUndefined,
      situationFamille: formatUndefined,
      revenuBrutGlobal: withNulls ? formatNull : formatUndefined,
      revenuImposable: withNulls ? formatNull : formatUndefined,
      impotRevenuNetAvantCorrections: withNulls ? formatNull : formatUndefined,
      montantImpot: withNulls ? formatNull : formatUndefined,
      revenuFiscalReference: withNulls ? formatNull : formatUndefined,
      nombrePersonnesCharge: identity,
      anneeImpots: formatYears,
      anneeRevenus: formatYears,
      erreurCorrectif: identity,
      siturationPartielle: identity,
    };

    const presentKeys = Object.keys(config).filter(key => has(input, key));

    return presentKeys.reduce((result, key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return set(result, key, config[key](get(input, key)));
    }, {}) as Record<string, unknown>;
  }
}
