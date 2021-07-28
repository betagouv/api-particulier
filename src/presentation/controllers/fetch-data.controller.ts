import {z} from 'zod';
import {NextFunction, Request, Response} from 'express';
import {DgfipInput} from 'src/domain/data-fetching/data-providers/dgfip/dto';
import {dgfipInputSchema} from 'src/presentation/middlewares/dgfip-input-validation.middleware';
import {
  cnafDataPresenter,
  dgfipDataPresenter,
  fetchDataUsecase,
} from 'src/infrastructure/service-container';
import {TokenValue} from 'src/domain/token-value';
import {Token} from 'src/domain/data-fetching/projections/token';
import {cnafInputSchema} from 'src/presentation/middlewares/cnaf-input-validation.middleware';
import {CnafInput} from 'src/domain/data-fetching/data-providers/cnaf/dto';

export const fetchDgfipDataControllerBuidler =
  (withNulls: boolean) =>
  async (
    req: Request<never, never, never, z.infer<typeof dgfipInputSchema>>,
    res: Response,
    next: NextFunction
  ) => {
    const input: DgfipInput = {
      taxNumber: req.query.numeroFiscal,
      taxNoticeNumber: req.query.referenceAvis,
    };
    const tokenValue = req.header('X-Api-Key') as TokenValue;
    try {
      const data = await fetchDataUsecase.fetchDgfipData(
        tokenValue,
        input,
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
  () =>
  async (
    req: Request<never, never, never, z.infer<typeof cnafInputSchema>>,
    res: Response,
    next: NextFunction
  ) => {
    const input: CnafInput = {
      numeroAllocataire: req.query.numeroAllocataire,
      codePostal: req.query.codePostal,
    };
    const tokenValue = req.header('X-Api-Key') as TokenValue;
    try {
      const data = await fetchDataUsecase.fetchCnafData(
        tokenValue,
        input,
        req.path,
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
