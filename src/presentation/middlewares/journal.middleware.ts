import {Request, Response, NextFunction} from 'express';
import {TokenConsumed} from 'src/domain/data-fetching/events/token-consumed.event';
import {Token} from 'src/domain/data-fetching/projections/token';
import {Subscription} from 'src/domain/subscription';
import {eventBus} from 'src/infrastructure/service-container';

export const journalMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {token, startTime} = res.locals as {token: Token; startTime: number};
  if (!token) {
    throw new Error('No token found in locals');
  }
  if (!startTime) {
    throw new Error('No startTime found in locals');
  }
  const timeSpent = new Date().getTime() - startTime;
  const subscription = getSubscriptionFromRoute(req.path);
  eventBus.publish(
    new TokenConsumed(
      token.applicationId,
      new Date(),
      subscription,
      req.path,
      res.statusCode,
      timeSpent
    )
  );
  next();
};

const getSubscriptionFromRoute = (route: string): Subscription => {
  switch (route) {
    case '/api/v2/avis-imposition':
    case '/api/impots/svair':
      return 'DGFIP';
    default:
      throw new Error(`No subscription found for route ${route}`);
  }
};
