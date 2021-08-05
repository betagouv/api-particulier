import {captureException} from '@sentry/node';
import {snakeCase} from 'lodash';
import {NetworkError} from 'src/domain/data-fetching/errors/network.error';
import {logFor} from 'src/domain/logger';
import {ErrorPresenter} from 'src/presentation/presenters/error-presenters/error-presenter';

const logger = logFor('ServerErrorPresenter');

export const networkErrorPresenter: ErrorPresenter<NetworkError> = (
  error: NetworkError
) => {
  logger.log('error', `Erreur capturée: ${error.constructor.name}`, {
    error: error,
    stack: error.stack,
  });
  captureException(error);

  return {
    statusCode: error.status ?? 503,
    error: snakeCase(error.name),
    reason: error.message,
    message: "Une erreur est survenue lors de l'appel du fournisseur de donnée",
  };
};
