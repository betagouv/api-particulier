import {captureException} from '@sentry/node';
import {Request, Response, NextFunction} from 'express';
import {snakeCase} from 'lodash';
import {CnafError} from 'src/domain/data-fetching/data-providers/cnaf/errors/cnaf.error';
import {InvalidCredentialsError} from 'src/domain/data-fetching/data-providers/dgfip/errors/invalid-credentials.error';
import {InvalidFormatError} from 'src/domain/data-fetching/data-providers/dgfip/errors/invalid-format.error';
import {RateLimitedError} from 'src/domain/data-fetching/data-providers/dgfip/errors/rate-limited.error';
import {ApplicationNotSubscribedError} from 'src/domain/data-fetching/errors/application-not-subscribed.error';
import {NetworkError} from 'src/domain/data-fetching/errors/network.error';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {logFor} from 'src/domain/logger';
import {cnafDataPresenter} from 'src/infrastructure/service-container';
import {ZodError} from 'zod';

const logger = logFor('ManageErrorMiddleware');

const logError = (error: Error) => {
  logger.log('error', `Erreur capturée: ${error.constructor.name}`, {
    error: error,
    stack: error.stack,
  });
};

export const manageErrorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (error instanceof RateLimitedError) {
    res.status(509).json({
      error: 'rate_limited',
      reason: error.message,
      message:
        "Le fournisseur de donnée a rejeté la demande en raison d'un trop grand nombre d'échecs antérieurs.",
    });
    captureException(error);
    return next();
  }
  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'bad_request',
      reason:
        'Les paramètres numeroFiscal et referenceAvis doivent être fournis dans la requête.',
      message:
        'Les paramètres numeroFiscal et referenceAvis doivent être fournis dans la requête.',
    });
    return next();
  }
  if (error instanceof InvalidCredentialsError) {
    res.status(404).json({
      error: 'not_found',
      reason:
        'Les paramètres fournis sont incorrects ou ne correspondent pas à un avis',
      message:
        'Les paramètres fournis sont incorrects ou ne correspondent pas à un avis',
    });
    return next();
  }
  if (error instanceof CnafError) {
    const presentedError = cnafDataPresenter.presentError(error);
    res.status(presentedError.statusCode).json({
      error: presentedError.error,
      reason: presentedError.reason,
      message: presentedError.message,
    });
    return next();
  }
  if (error instanceof InvalidFormatError) {
    res.status(502).json({
      error: 'invalid_response',
      reason: error.message,
      message: 'La réponse du fournisseur de donnée est inexploitable',
    });
    logError(error);
    captureException(error);
    return next();
  }
  if (error instanceof NetworkError) {
    res.status(error.status ?? 503).json({
      error: snakeCase(error.name),
      reason: error.message,
      message:
        "Une erreur est survenue lors de l'appel du fournisseur de donnée",
    });
    captureException(error);
    logError(error);
    return next();
  }
  if (error instanceof TokenNotFoundError) {
    res.status(401).json({
      error: 'acces_denied',
      reason: 'Token not found or inactive',
      message: "Votre jeton d'API n'a pas été trouvé ou n'est pas actif",
    });
    return next();
  }
  if (error instanceof ApplicationNotSubscribedError) {
    res.status(200).json({});
    return next();
  }
  res.status(500).json({
    error: snakeCase(error.constructor.name),
    reason: 'Internal server error',
    message: "Une erreur interne s'est produite, l'équipe a été prévenue.",
  });
  logError(error);
  captureException(error);
  return next();
};
