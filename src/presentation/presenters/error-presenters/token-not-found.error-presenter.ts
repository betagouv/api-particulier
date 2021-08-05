import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {ErrorPresenter} from 'src/presentation/presenters/error-presenters/error-presenter';

export const tokenNotFoundErrorPresenter: ErrorPresenter<TokenNotFoundError> =
  () => {
    return {
      statusCode: 401,
      error: 'acces_denied',
      reason: 'Token not found or inactive',
      message: "Votre jeton d'API n'a pas été trouvé ou n'est pas actif",
    };
  };
