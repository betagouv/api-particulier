import {z} from 'zod';
import {NextFunction, Request, Response} from 'express';
import {DgfipInput} from 'src/domain/data-fetching/data-providers/dgfip/dto';
import {dgfipInputSchema} from 'src/presentation/middlewares/dgfip-input-validation.middleware';
import {
  dgfipDataPresenter,
  fetchDataUsecase,
} from 'src/infrastructure/service-container';
import {TokenValue} from 'src/domain/token-value';

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
        req.path
      );

      res.json(dgfipDataPresenter.presentData(data, withNulls));
      return next();
    } catch (error) {
      return next(error);
    }
  };
