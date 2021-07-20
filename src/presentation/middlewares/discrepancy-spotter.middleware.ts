import {Request, Response, NextFunction} from 'express';
import {logFor} from 'src/domain/logger';

const logger = logFor('DiscrepancyCheckerMiddleware');

export const discrepancyCheckerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const initialMethod = res.json;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  res.json = (body: unknown) => {
    logger.log('debug', 'JSON response', {body, status: res.statusCode});
    initialMethod.call(res, body);
  };
  next();
};
