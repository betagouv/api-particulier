import {NextFunction, Request, Response} from 'express';
import {
  cnafDataPresenter,
  dgfipDataPresenter,
  fetchDataUsecase,
  fetchDataWithFranceConnectUsecase,
  mesriDataPresenter,
  poleEmploiDataPresenter,
} from 'src/infrastructure/service-container';
import {TokenValue} from 'src/domain/token-value';
import {Token} from 'src/domain/data-fetching/projections/token';
import {MesriOutput} from 'src/domain/data-fetching/data-providers/mesri/dto';

export const fetchDgfipDataControllerBuidler =
  (withNulls: boolean) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const {credential} = getApiKeyOrAccessTokenFromRequest(req);
    try {
      const data = await fetchDataUsecase.fetchDgfipData(
        credential,
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
    const {credential} = getApiKeyOrAccessTokenFromRequest(req);
    try {
      const data = await fetchDataUsecase.fetchCnafData(
        credential,
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
    const {credential} = getApiKeyOrAccessTokenFromRequest(req);
    try {
      const data = await fetchDataUsecase.fetchPoleEmploiData(
        credential,
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
    const {credential, type} = getApiKeyOrAccessTokenFromRequest(req);
    try {
      let data;
      if (type === 'api-key') {
        data = await fetchDataUsecase.fetchMesriData(
          credential,
          res.locals.input,
          (token: Token) => {
            res.locals.token = token;
          }
        );
      }
      if (type === 'france-connect') {
        data = await fetchDataWithFranceConnectUsecase.fetchMesriData(
          credential,
          (token: Token) => {
            res.locals.token = token;
          }
        );
      }

      res.json(mesriDataPresenter.presentData(<Partial<MesriOutput>>data));
      return next();
    } catch (error) {
      return next(error);
    }
  };

const getApiKeyOrAccessTokenFromRequest = (
  req: Request
): {credential: TokenValue; type: 'api-key' | 'france-connect'} => {
  const apiKey = req.header('X-Api-Key');
  const rawFranceConnectToken = req.header('Authorization')?.split(' ');
  const franceConnectToken = rawFranceConnectToken
    ? rawFranceConnectToken.length > 1
      ? rawFranceConnectToken[1]
      : undefined
    : undefined;
  if (apiKey !== undefined) {
    return {
      credential: apiKey as TokenValue,
      type: 'api-key',
    };
  }
  if (franceConnectToken !== undefined) {
    return {
      credential: franceConnectToken as TokenValue,
      type: 'france-connect',
    };
  }
  throw new Error('Missing credentials');
};
