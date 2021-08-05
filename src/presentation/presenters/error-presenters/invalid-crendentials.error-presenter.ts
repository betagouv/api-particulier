import {InvalidCredentialsError} from 'src/domain/data-fetching/data-providers/dgfip/errors/invalid-credentials.error';
import {ErrorPresenter} from 'src/presentation/presenters/error-presenters/error-presenter';

export const invalidCredentialsErrorPresenter: ErrorPresenter<InvalidCredentialsError> =
  () => {
    return {
      statusCode: 404,
      error: 'not_found',
      reason:
        'Les paramètres fournis sont incorrects ou ne correspondent pas à un avis',
      message:
        'Les paramètres fournis sont incorrects ou ne correspondent pas à un avis',
    };
  };
