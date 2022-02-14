import {MesriOutput} from 'src/domain/data-fetching/data-providers/mesri/dto';
import {logFor} from 'src/domain/logger';
import {formatDate} from 'src/presentation/presenters/date-presenter';

export class MesriDataPresenter {
  private readonly logger = logFor(MesriDataPresenter.name);

  presentData(input: Partial<MesriOutput>) {
    const result = {
      ...input,
      dateNaissance: formatDate(input.dateNaissance),
      inscriptions: (input.inscriptions || []).map(inscription => ({
        ...inscription,
        dateDebutInscription: formatDate(inscription.dateDebutInscription),
        dateFinInscription: formatDate(inscription.dateFinInscription),
      })),
    };

    this.logger.log('debug', 'Presented MESRI data', {
      input,
      result,
    });
    return result;
  }
}
