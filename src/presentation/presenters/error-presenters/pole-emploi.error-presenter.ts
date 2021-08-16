import {NotFoundError} from 'src/domain/data-fetching/data-providers/pole-emploi/errors/not-found.error';
import {ErrorPresenter} from 'src/presentation/presenters/error-presenters/error-presenter';

export const poleEmploiErrorPresenter: ErrorPresenter<NotFoundError> = () => {
  return {
    statusCode: 404,
    error: 'not_found',
    reason: 'Situation not found',
    message:
      "Aucune situation Pôle Emploi n'a pu être trouvée avec les critères de recherche fournis",
  };
};
