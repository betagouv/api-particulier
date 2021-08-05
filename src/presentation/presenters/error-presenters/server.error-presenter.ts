import {captureException} from '@sentry/node';
import {snakeCase} from 'lodash';
import {logFor} from 'src/domain/logger';
import {ErrorPresenter} from 'src/presentation/presenters/error-presenters/error-presenter';

const logger = logFor('ServerErrorPresenter');

export const serverErrorPresenter: ErrorPresenter<Error> = (error: Error) => {
  logger.log('error', `Erreur capturée: ${error.constructor.name}`, {
    error: error,
    stack: error.stack,
  });
  captureException(error);

  return {
    statusCode: 500,
    error: snakeCase(error.constructor.name),
    reason: 'Internal server error',
    message: "Une erreur interne s'est produite, l'équipe a été prévenue.",
  };
};
