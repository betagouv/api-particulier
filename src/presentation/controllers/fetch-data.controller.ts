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
import {Credentials} from 'src/domain/credentials';

export const fetchDgfipDataControllerBuidler =
  (withNulls: boolean) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const credentials = getCredentialsFromRequest(req);
    try {
      const data = await fetchDataUsecase.fetchDgfipData(
        credentials,
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
    const credentials = getCredentialsFromRequest(req);
    try {
      const data = await fetchDataUsecase.fetchCnafData(
        credentials,
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

export const fetchPoleEmploiDataControllerBuidler =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const credentials = getCredentialsFromRequest(req);
    try {
      const data = await fetchDataUsecase.fetchPoleEmploiData(
        credentials,
        res.locals.input,
        req.baseUrl + req.path,
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
    const credentials = getCredentialsFromRequest(req);
    try {
      const data = await fetchDataUsecase.fetchMesriData(
        credentials,
        res.locals.input,
        req.baseUrl + req.path,
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

const getCredentialsFromRequest = (req: Request): Credentials => {
  const apiKey = req.header('X-Api-Key');
  if (apiKey !== undefined) {
    return {
      tokenValue: <TokenValue>apiKey,
      type: 'api-key',
    };
  }
  const accessToken = req.header('Authorization')?.split(' ')[1];
  if (accessToken) {
    return {
      tokenValue: <TokenValue>accessToken,
      type: 'access-token',
    };
  }
  throw new Error('No credentials found despite request validation');
};
