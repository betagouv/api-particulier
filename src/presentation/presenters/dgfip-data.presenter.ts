import {format} from 'date-fns';
import {get, has, identity, set} from 'lodash';
import {DgfipOutput} from 'src/domain/data-fetching/data-providers/dgfip/dto';
import {logFor} from 'src/domain/logger';

const dateToString = (date?: Date) => {
  if (!date) {
    return '';
  }
  try {
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    return '';
  }
};
const dateToStringOrUndefined = (date?: Date) => {
  if (date === undefined) {
    return undefined;
  }
  return dateToString(date);
};
const undefinedToNull = (value?: unknown) =>
  value === undefined ? null : value;
const yearToString = (value?: number) =>
  value === undefined ? '' : value.toString();
const dateOrStringToStringOrUndefined = (date?: Date | string) => {
  if (typeof date === 'string') {
    return date;
  }
  return dateToStringOrUndefined(date);
};
const dateOrStringToString = (date?: Date | string) => {
  if (typeof date === 'string') {
    return date;
  }
  return dateToString(date);
};

export class DgfipDataPresenter {
  private readonly logger = logFor(DgfipDataPresenter.name);

  presentData(input: Partial<DgfipOutput>, withNulls: boolean) {
    const config = {
      'declarant1.nom': identity,
      'declarant1.nomNaissance': identity,
      'declarant1.prenoms': identity,
      'declarant1.dateNaissance': dateOrStringToString,
      'declarant2.nom': identity,
      'declarant2.nomNaissance': identity,
      'declarant2.prenoms': identity,
      'declarant2.dateNaissance': dateOrStringToString,
      'foyerFiscal.adresse': identity,
      'foyerFiscal.annee': identity,
      dateRecouvrement: dateOrStringToStringOrUndefined,
      dateEtablissement: dateOrStringToString,
      nombreParts: identity,
      situationFamille: identity,
      revenuBrutGlobal: withNulls ? undefinedToNull : identity,
      revenuImposable: withNulls ? undefinedToNull : identity,
      impotRevenuNetAvantCorrections: withNulls ? undefinedToNull : identity,
      montantImpot: withNulls ? undefinedToNull : identity,
      revenuFiscalReference: withNulls ? undefinedToNull : identity,
      nombrePersonnesCharge: identity,
      anneeImpots: yearToString,
      anneeRevenus: yearToString,
      erreurCorrectif: identity,
      situationPartielle: identity,
    };

    const result = Object.keys(config).reduce((result, key) => {
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
