import {Request, Response, NextFunction} from 'express';
import {ResponseSent} from 'src/domain/data-fetching/events/response-sent.event';
import {eventBus} from 'src/infrastructure/service-container';

export const discrepancyCheckerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const initialMethod = res.json;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  res.json = (data: object) => {
    initialMethod.call(res, data);
    eventBus.publish(
      new ResponseSent(
        res.locals?.token?.applicationId ?? '',
        new Date(),
        req.path,
        req.query,
        req.headers,
        res.statusCode,
        data
      )
    );
  };
  next();
};
