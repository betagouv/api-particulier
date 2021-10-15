import {NextFunction, Request, Response} from 'express';
import {
  fetchDataUsecase,
  mesriDataPresenter,
} from 'src/infrastructure/service-container';
import {TokenValue} from 'src/domain/token-value';
import {Token} from 'src/domain/data-fetching/projections/token';
import {MesriOutput} from 'src/domain/data-fetching/data-providers/mesri/dto';

export const fetchMesriDataController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = getAccessTokenFromRequest(req);
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

const getAccessTokenFromRequest = (req: Request): TokenValue => {
  const accessToken = req.header('Authorization')?.split(' ')[1];
  return accessToken as TokenValue;
};
