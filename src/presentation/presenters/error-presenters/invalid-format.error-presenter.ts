import {captureException} from '@sentry/node';
import {InvalidFormatError} from 'src/domain/data-fetching/errors/invalid-format.error';
import {NetworkError} from 'src/domain/data-fetching/errors/network.error';
import {logFor} from 'src/domain/logger';
import {ErrorPresenter} from 'src/presentation/presenters/error-presenters/error-presenter';

const logger = logFor('ServerErrorPresenter');

export const invalidFormatErrorPresenter: ErrorPresenter<InvalidFormatError> = (
  error: NetworkError
) => {
  logger.log('error', `Erreur capturée: ${error.constructor.name}`, {
    error: error,
    stack: error.stack,
  });
  captureException(error);

  return {
    statusCode: 502,
    error: 'invalid_response',
    reason: error.message,
    message: 'La réponse du fournisseur de donnée est inexploitable',
  };
};
