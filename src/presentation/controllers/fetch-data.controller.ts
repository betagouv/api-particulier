import {NextFunction, Request, Response} from 'express';
import {
  cnafDataPresenter,
  dgfipDataPresenter,
  fetchDataUsecase,
  mesriDataPresenter,
  poleEmploiDataPresenter,
} from 'src/infrastructure/service-container';
import {TokenValue} from 'src/domain/token-value';
import {Token} from 'src/domain/data-fetching/projections/token';
import {MesriOutput} from 'src/domain/data-fetching/data-providers/mesri/dto';

export const fetchDgfipDataControllerBuidler =
  (withNulls: boolean) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = getApiKeyFromRequest(req);
    try {
      const data = await fetchDataUsecase.fetchDgfipData(
        apiKey,
        res.locals.input,
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
    const apiKey = getApiKeyFromRequest(req);
    try {
      const data = await fetchDataUsecase.fetchCnafData(
        apiKey,
        res.locals.input,
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

export const fetchPoleEmploiDataControllerBuidler =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = getApiKeyFromRequest(req);
    try {
      const data = await fetchDataUsecase.fetchPoleEmploiData(
        apiKey,
        res.locals.input,
        (token: Token) => {
          res.locals.token = token;
        }
      );

      res.json(poleEmploiDataPresenter.presentData(data));
      return next();
    } catch (error) {
      return next(error);
    }
  };

export const fetchMesriDataControllerBuidler =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = getApiKeyFromRequest(req);
    try {
      const data = await fetchDataUsecase.fetchMesriData(
        apiKey,
        res.locals.input,
        (token: Token) => {
          res.locals.token = token;
        }
      );

      res.json(mesriDataPresenter.presentData(<Partial<MesriOutput>>data));
      return next();
    } catch (error) {
      return next(error);
    }
  };

const getApiKeyFromRequest = (req: Request): TokenValue => {
  const apiKey = req.header('X-Api-Key');
  return apiKey as TokenValue;
};
