import {NextFunction, Request, Response} from 'express';
import {CreateApplicationDto} from 'src/domain/data-fetching/dtos/create-application.dto';
import {AnyScope} from 'src/domain/scopes';
import {createApplicationUsecase} from 'src/infrastructure/service-container';

export const createPortailApplicationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await createApplicationUsecase.createApplication(
      new CreateApplicationDto(
        req.body.name,
        '0',
        <AnyScope[]>Object.keys(req.body.scopes),
        [req.user!.email]
      )
    );
    setTimeout(() => {
      res.redirect('/');
    }, 100);
  } catch (error) {
    next(error);
  }
};
