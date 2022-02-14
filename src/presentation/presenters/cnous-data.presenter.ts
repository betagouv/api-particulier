import {CnousOutput} from 'src/domain/data-fetching/data-providers/cnous/dto';
import {logFor} from 'src/domain/logger';
import {formatDate} from 'src/presentation/presenters/date-presenter';

export class CnousDataPresenter {
  private readonly logger = logFor(CnousDataPresenter.name);

  presentData(input: Partial<CnousOutput>) {
    const result = {
      ...input,
      dateNaissance: formatDate(input.dateNaissance),
      dateDeRentree: formatDate(input.dateDeRentree),
    };

    this.logger.log('debug', 'Presented CNOUS data', {
      input,
      result,
    });
    return result;
  }
}
