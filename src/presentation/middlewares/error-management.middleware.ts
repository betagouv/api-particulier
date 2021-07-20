import {Request, Response, NextFunction} from 'express';
import {snakeCase} from 'lodash';
import {InvalidCredentialsError} from 'src/domain/data-fetching/data-providers/dgfip/errors/invalid-credentials.error';
import {InvalidFormatError} from 'src/domain/data-fetching/data-providers/dgfip/errors/invalid-format.error';
import {ApplicationNotSubscribedError} from 'src/domain/data-fetching/errors/application-not-subscribed.error';
import {NetworkError} from 'src/domain/data-fetching/errors/network.error';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';

export const manageErrorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (error instanceof InvalidCredentialsError) {
    return res.status(404).json({
      error: 'not_found',
      reason:
        'Les paramètres fournis sont incorrects ou ne correspondent pas à un avis',
      message:
        'Les paramètres fournis sont incorrects ou ne correspondent pas à un avis',
    });
  }
  if (error instanceof InvalidFormatError) {
    return res.status(502).json({
      error: 'invalid_response',
      reason: error.message,
      message: 'La réponse du fournisseur de donnée est inexploitable',
    });
  }
  if (error instanceof NetworkError) {
    return res.status(error.status ?? 503).json({
      error: snakeCase(error.name),
      reason: error.message,
      message:
        "Une erreur est survenue lors de l'appel du fournisseur de donnée",
    });
  }
  if (error instanceof TokenNotFoundError) {
    return res.status(401).json({
      error: 'acces_denied',
      reason: 'Token not found or inactive',
      message: "Votre jeton d'API n'a pas été trouvé ou n'est pas actif",
    });
  }
  if (error instanceof ApplicationNotSubscribedError) {
    return res.status(403).json({
      error: 'unauthorized',
      reason: 'Data provider call forbidden',
      message:
        "Votre jeton d'API ne vous permet pas de faire appel à la route que vous avez demandée",
    });
  }
  return res.status(500).json({
    error: snakeCase(error.constructor.name),
    reason: 'Internal server error',
    message: "Une erreur interne s'est produite, l'équipe a été prévenue.",
  });
};
