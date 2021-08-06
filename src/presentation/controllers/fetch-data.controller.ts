import {NextFunction, Request, Response} from 'express';
import {
  cnafDataPresenter,
  dgfipDataPresenter,
  fetchDataUsecase,
} from 'src/infrastructure/service-container';
import {TokenValue} from 'src/domain/token-value';
import {Token} from 'src/domain/data-fetching/projections/token';

export const fetchDgfipDataControllerBuidler =
  (withNulls: boolean) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const tokenValue = req.header('X-Api-Key') as TokenValue;
    try {
      const data = await fetchDataUsecase.fetchDgfipData(
        tokenValue,
        res.locals.input,
        req.path,
        (token: Token) => {
          res.locals.token = token;
        }
      );

      res.json(dgfipDataPresenter.presentData(data, withNulls));
      return next();
    } catch (error) {
      return next(error);
    }
  };

export const fetchCnafDataControllerBuidler =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const tokenValue = req.header('X-Api-Key') as TokenValue;
    try {
      const data = await fetchDataUsecase.fetchCnafData(
        tokenValue,
        res.locals.input,
        req.baseUrl + req.path,
        (token: Token) => {
          res.locals.token = token;
        }
      );

      res.json(cnafDataPresenter.presentData(data));
      return next();
    } catch (error) {
      return next(error);
    }
  };
