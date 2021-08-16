import {NotFoundError} from 'src/domain/data-fetching/data-providers/mesri/errors/not-found.error';
import {ErrorPresenter} from 'src/presentation/presenters/error-presenters/error-presenter';

export const mesriErrorPresenter: ErrorPresenter<NotFoundError> = () => {
  return {
    statusCode: 404,
    error: 'not_found',
    reason: 'Student not found',
    message:
      "Aucun étudiant n'a pu être trouvé avec les critères de recherche fournis",
  };
};
