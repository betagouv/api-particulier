import {NextFunction, Request, Response} from 'express';
import {
  cnafDataPresenter,
  cnoustDataPresenter,
  dgfipDataPresenter,
  fetchDataUsecase,
  fetchDataWithFranceConnectUsecase,
  mesriDataPresenter,
  poleEmploiDataPresenter,
} from 'src/infrastructure/service-container';
import {Token} from 'src/domain/data-fetching/projections/token';
import {MesriOutput} from 'src/domain/data-fetching/data-providers/mesri/dto';
import {Credentials} from 'src/domain/credentials';
import {CnousOutput} from 'src/domain/data-fetching/data-providers/cnous/dto';

export const fetchDgfipDataControllerBuidler =
  (withNulls: boolean) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const credentials: Credentials = res.locals.credentials;
    try {
      const data = await fetchDataUsecase.fetchDgfipData(
        credentials.tokenValue,
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
    const credentials: Credentials = res.locals.credentials;
    try {
      const data = await fetchDataUsecase.fetchCnafData(
        credentials.tokenValue,
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
    const credentials: Credentials = res.locals.credentials;
    try {
      const data = await fetchDataUsecase.fetchPoleEmploiData(
        credentials.tokenValue,
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
    const credentials: Credentials = res.locals.credentials;
    try {
      const data =
        credentials.type === 'api-key'
          ? await fetchDataUsecase.fetchMesriData(
              credentials.tokenValue,
              res.locals.input,
              (token: Token) => {
                res.locals.token = token;
              }
            )
          : await fetchDataWithFranceConnectUsecase.fetchMesriData(
              credentials.tokenValue,
              (token: Token) => {
                res.locals.token = token;
              },
              (inputData: unknown) => {
                res.locals.input = inputData;
              }
            );

      res.json(mesriDataPresenter.presentData(<Partial<MesriOutput>>data));
      return next();
    } catch (error) {
      return next(error);
    }
  };

export const fetchCnousDataControllerBuidler =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const credentials: Credentials = res.locals.credentials;
    try {
      const data =
        credentials.type === 'api-key'
          ? await fetchDataUsecase.fetchCnousData(
              credentials.tokenValue,
              res.locals.input,
              (token: Token) => {
                res.locals.token = token;
              }
            )
          : await fetchDataWithFranceConnectUsecase.fetchCnousData(
              credentials.tokenValue,
              (token: Token) => {
                res.locals.token = token;
              },
              (inputData: unknown) => {
                res.locals.input = inputData;
              }
            );

      res.json(cnoustDataPresenter.presentData(<Partial<CnousOutput>>data));
      return next();
    } catch (error) {
      return next(error);
    }
  };
