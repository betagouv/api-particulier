import {z} from 'zod';
import {Request, Response, NextFunction} from 'express';
import {DgfipInput} from 'src/domain/data-fetching/data-providers/dgfip/dto';
import {dgfipInputSchema} from 'src/presentation/middlewares/dgfip-input-validation.middleware';
import {fetchDataUsecase} from 'src/infrastructure/service-container';
import {TokenValue} from 'src/domain/token-value';

export async function fetchDgfipData(
  req: Request<never, never, never, z.infer<typeof dgfipInputSchema>>,
  res: Response,
  next: NextFunction
) {
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

    return res.json(data);
  } catch (error) {
    next(error);
    return;
  }
}
