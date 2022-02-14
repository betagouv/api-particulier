import {NotFoundError} from 'src/domain/data-fetching/data-providers/cnous/errors/not-found.error';
import {ErrorPresenter} from 'src/presentation/presenters/error-presenters/error-presenter';

export const cnousErrorPresenter: ErrorPresenter<NotFoundError> = () => {
  return {
    statusCode: 404,
    error: 'not_found',
    reason: 'Scholarship not found',
    message:
      "Aucun étudiant boursier n'a pu être trouvé avec les critères de recherche fournis",
  };
};
