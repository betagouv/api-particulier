import {PoleEmploiOutput} from 'src/domain/data-fetching/data-providers/pole-emploi/dto';
import {logFor} from 'src/domain/logger';
import {formatDate} from 'src/presentation/presenters/date-presenter';

export class PoleEmploiDataPresenter {
  private readonly logger = logFor(PoleEmploiDataPresenter.name);

  presentData(input: Partial<PoleEmploiOutput>) {
    const result = {
      ...input,
      dateNaissance: formatDate(input.dateNaissance),
      dateCessationInscription: formatDate(input.dateCessationInscription),
      dateInscription: formatDate(input.dateInscription),
    };

    this.logger.log('debug', 'Presented Pole Emploi data', {
      input,
      result,
    });
    return result;
  }
}
