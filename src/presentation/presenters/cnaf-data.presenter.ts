import {format} from 'date-fns';
import {CnafOutput} from 'src/domain/data-fetching/data-providers/cnaf/dto';
import {CnafError} from 'src/domain/data-fetching/data-providers/cnaf/errors/cnaf.error';
import {logFor} from 'src/domain/logger';

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
    switch (error.errorCode) {
      case 141:
        return {
          statusCode: 404,
          error: 'not_found',
          reason: 'Non droit. Le document ne peut être édité.',
          message: 'Non droit. Le document ne peut être édité.',
        };
      default:
        return {
          statusCode: 404,
          error: 'not_found',
          reason: 'Non droit. Le document ne peut être édité.',
          message: 'Non droit. Le document ne peut être édité.',
        };
    }
  }
}
