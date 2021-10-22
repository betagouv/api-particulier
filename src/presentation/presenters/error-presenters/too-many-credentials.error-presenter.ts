import {TooManyCredentialsError} from 'src/domain/data-fetching/errors/too-many-credentials.error';
import {ErrorPresenter} from 'src/presentation/presenters/error-presenters/error-presenter';

export const tooManyCredentialsErrorPresenter: ErrorPresenter<TooManyCredentialsError> =
  () => {
    return {
      statusCode: 401,
      error: 'too_many_credentials_provided',
      reason:
        'Too many credentials provided, both API key and access token were found',
      message:
        "Votre requête porte trop de moyens d'authentification, veuillez choisir entre clé d'API ou jeton FranceConnect",
    };
  };
