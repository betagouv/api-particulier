import {format} from 'date-fns';
import {CnafOutput} from 'src/domain/data-fetching/data-providers/cnaf/dto';
import {CnafError} from 'src/domain/data-fetching/data-providers/cnaf/errors/cnaf.error';
import {logFor} from 'src/domain/logger';
import cnafErrors from 'src/presentation/presenters/cnaf-errors.json';

const formatDate = (date?: Date) => {
  if (!date) {
    return '';
  }
  return format(date, 'ddMMyyyy');
};

const formatPersons = (persons: CnafOutput['allocataires'] | undefined) =>
  persons?.map(person => ({
    ...person,
    dateDeNaissance: formatDate(person.dateDeNaissance),
  }));

export class CnafDataPresenter {
  private readonly logger = logFor(CnafDataPresenter.name);

  presentData(input: Partial<CnafOutput>) {
    const result = {
      ...input,
      allocataires: formatPersons(input.allocataires),
      enfants: formatPersons(input.enfants),
    };

    this.logger.log('debug', 'Presented CNAF data', {
      input,
      result,
    });
    return result;
  }

  presentError(error: CnafError) {
    type CnafErrors = {[key: string]: {msg: string; code: number}};
    const foundError = (cnafErrors as unknown as CnafErrors)[
      error.errorCode.toString()
    ];
    if (!foundError) {
      return {
        statusCode: 503,
        error: 'data_provider_error',
        reason: `Unknown error code ${error.errorCode}`,
        message: 'Erreur inconnue du fournisseur de donnée CAF',
      };
    }

    return {
      statusCode: foundError.code,
      error: 'not_found',
      reason: foundError.msg,
      message: foundError.msg,
    };
  }
}
