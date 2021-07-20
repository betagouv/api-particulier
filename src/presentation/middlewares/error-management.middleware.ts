import {Request, Response, NextFunction} from 'express';
import {snakeCase} from 'lodash';
import {ApplicationNotSubscribedError} from 'src/domain/data-fetching/errors/application-not-subscribed.error';
import {NetworkError} from 'src/domain/data-fetching/errors/network.error';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';

export const manageErrorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof NetworkError) {
    return res.status(404).json({
      error: 'not_found',
      reason:
        'Les paramètres fournis sont incorrects ou ne correspondent pas à un avis',
      message:
        'Les paramètres fournis sont incorrects ou ne correspondent pas à un avis',
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
