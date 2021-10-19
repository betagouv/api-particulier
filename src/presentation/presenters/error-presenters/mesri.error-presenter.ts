import {NoEnrollmentError} from 'src/domain/data-fetching/data-providers/mesri/errors/no-enrollment.error';
import {NotFoundError} from 'src/domain/data-fetching/data-providers/mesri/errors/not-found.error';
import {ErrorPresenter} from 'src/presentation/presenters/error-presenters/error-presenter';

export const mesriErrorPresenter: ErrorPresenter<
  NotFoundError | NoEnrollmentError
> = (error: NotFoundError | NoEnrollmentError) => {
  if (error instanceof NotFoundError) {
    return {
      statusCode: 404,
      error: 'not_found',
      reason: 'Student not found',
      message:
        "Aucun étudiant n'a pu être trouvé avec les critères de recherche fournis",
    };
  } else {
    return {
      statusCode: 404,
      error: 'no_enrollment',
      reason: 'No enrollment found',
      message:
        'Inscriptions introuvables selon les autorisations accordées à votre application.',
    };
  }
};
