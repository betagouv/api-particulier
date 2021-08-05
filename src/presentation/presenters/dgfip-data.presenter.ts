import {format} from 'date-fns';
import {get, has, identity, set} from 'lodash';
import {DgfipOutput} from 'src/domain/data-fetching/data-providers/dgfip/dto';
import {logFor} from 'src/domain/logger';

const formatDate = (date?: Date) => {
  if (!date) {
    return '';
  }
  try {
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    return '';
  }
};

const formatUndefined = (value?: unknown) =>
  value === undefined || value === null ? undefined : value;
const formatNull = (value?: unknown) => (value === undefined ? null : value);
const formatYears = (value?: number) =>
  value === undefined ? '' : value.toString();
const formatDateOrString = (date?: Date | string) => {
  if (typeof date === 'string') {
    return date;
  }
  return formatDate(date);
};

export class DgfipDataPresenter {
  private readonly logger = logFor(DgfipDataPresenter.name);

  presentData(input: Partial<DgfipOutput>, withNulls: boolean) {
    const config = {
      'declarant1.nom': formatUndefined,
      'declarant1.nomNaissance': formatUndefined,
      'declarant1.prenoms': formatUndefined,
      'declarant1.dateNaissance': formatDateOrString,
      'declarant2.nom': formatUndefined,
      'declarant2.nomNaissance': formatUndefined,
      'declarant2.prenoms': formatUndefined,
      'declarant2.dateNaissance': formatDateOrString,
      'foyerFiscal.adresse': formatUndefined,
      'foyerFiscal.annee': identity,
      dateRecouvrement: formatDateOrString,
      dateEtablissement: formatDate,
      nombreParts: formatUndefined,
      situationFamille: formatUndefined,
      revenuBrutGlobal: withNulls ? formatNull : formatUndefined,
      revenuImposable: withNulls ? formatNull : formatUndefined,
      impotRevenuNetAvantCorrections: formatNull,
      montantImpot: formatNull,
      revenuFiscalReference: withNulls ? formatNull : formatUndefined,
      nombrePersonnesCharge: identity,
      anneeImpots: formatYears,
      anneeRevenus: formatYears,
      erreurCorrectif: identity,
      situationPartielle: identity,
    };

    const presentKeys = Object.keys(config).filter(key => has(input, key));

    const result = presentKeys.reduce((result, key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return set(result, key, config[key](get(input, key)));
    }, {}) as Record<string, unknown>;

    this.logger.log('debug', 'Presented DGFIP data', {
      input,
      result,
    });
    return result;
  }
}
