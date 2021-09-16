import {ErrorPresenter} from 'src/presentation/presenters/error-presenters/error-presenter';
import {ZodError} from 'zod';

export const zodErrorPresenter: ErrorPresenter<ZodError> = (
  error: ZodError
) => {
  if (
    error.flatten().fieldErrors.numeroFiscal ||
    error.flatten().fieldErrors.referenceAvis
  ) {
    return {
      statusCode: 400,
      error: 'bad_request',
      reason:
        'Les paramètres numeroFiscal et referenceAvis doivent être fournis dans la requête.',
      message:
        'Les paramètres numeroFiscal et referenceAvis doivent être fournis dans la requête.',
    };
  }
  if (
    error.flatten().fieldErrors.codePostal ||
    error.flatten().fieldErrors.numeroAllocataire
  ) {
    return {
      statusCode: 400,
      error: 'bad_request',
      reason:
        'Les paramètres `codePostal` et `numeroAllocataire` sont invalides, veuillez vérifier que vous les avez correctement saisis',
      message:
        'Les paramètres `codePostal` et `numeroAllocataire` sont invalides, veuillez vérifier que vous les avez correctement saisis',
    };
  }
  return {
    statusCode: 400,
    error: 'bad_request',
    reason: 'Invalid parameters provided',
    message: 'Les paramètres fournis sont invalides',
  };
};
