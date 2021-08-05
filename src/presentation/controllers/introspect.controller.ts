import {Request, Response, NextFunction} from 'express';
import {TokenValue} from 'src/domain/token-value';
import {
  introspectDataPresenter,
  introspectUsecase,
} from 'src/infrastructure/service-container';

export const introspectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenValue = req.header('X-Api-Key') as TokenValue;

  try {
    const introspectionResult = await introspectUsecase.introspectToken(
      tokenValue
    );

    const presentedData =
      introspectDataPresenter.presentData(introspectionResult);
    res.json(presentedData);
    return next();
  } catch (error) {
    return next(error);
  }
};
