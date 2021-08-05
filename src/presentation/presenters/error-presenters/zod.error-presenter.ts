import {ErrorPresenter} from 'src/presentation/presenters/error-presenters/error-presenter';
import {ZodError} from 'zod';

export const zodErrorPresenter: ErrorPresenter<ZodError> = () => {
  return {
    statusCode: 400,
    error: 'bad_request',
    reason:
      'Les paramètres numeroFiscal et referenceAvis doivent être fournis dans la requête.',
    message:
      'Les paramètres numeroFiscal et referenceAvis doivent être fournis dans la requête.',
  };
};
