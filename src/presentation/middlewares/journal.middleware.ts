import {Request, Response, NextFunction} from 'express';
import {TokenConsumed} from 'src/domain/data-fetching/events/token-consumed.event';
import {Token} from 'src/domain/data-fetching/projections/token';
import {Subscription} from 'src/domain/subscription';
import {eventBus} from 'src/infrastructure/service-container';

export const journalMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {token, startTime} = res.locals as {token: Token; startTime: number};
  if (!token) {
    return next();
  }
  if (!startTime) {
    throw new Error('No startTime found in locals');
  }
  const timeSpent = new Date().getTime() - startTime;
  const subscription = getSubscriptionFromRoute(req.baseUrl + req.path);
  await eventBus.publish(
    new TokenConsumed(
      new Date(),
      token.id,
      subscription,
      req.baseUrl + req.path,
      res.statusCode,
      timeSpent,
      res.locals.input
    )
  );
  next();
};

const getSubscriptionFromRoute = (route: string): Subscription => {
  switch (route) {
    case '/api/v2/avis-imposition':
    case '/api/impots/svair':
      return 'DGFIP';
    case '/api/v2/composition-familiale':
    case '/api/caf/famille':
      return 'CNAF';
    case '/api/v2/situations-pole-emploi':
      return 'POLE_EMPLOI';
    case '/api/v2/etudiants':
      return 'MESRI';
    default:
      throw new Error(`No subscription found for route ${route}`);
  }
};
