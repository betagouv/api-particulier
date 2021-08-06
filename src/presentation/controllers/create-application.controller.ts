import {NextFunction, Request, Response} from 'express';
import {CreateApplicationDto} from 'src/domain/data-fetching/dtos/create-application.dto';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {TokenValue} from 'src/domain/token-value';
import {createApplicationUsecase} from 'src/infrastructure/service-container';

export const createApplicationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.header('x-api-key');

  if (
    process.env.DATAPASS_API_KEY === undefined ||
    apiKey !== process.env.DATAPASS_API_KEY
  ) {
    return next(new TokenNotFoundError(apiKey as TokenValue));
  }

  try {
    const application = await createApplicationUsecase.createApplication(
      new CreateApplicationDto(
        res.locals.input.name,
        res.locals.input.dataPassId,
        res.locals.input.scopes,
        res.locals.input.userEmails
      )
    );
    res.json({id: application.id});
    next();
  } catch (error) {
    next(error);
  }
};
