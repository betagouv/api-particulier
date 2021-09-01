import {NextFunction, Request, Response} from 'express';
import {ApplicationId} from 'src/domain/application-id';
import {removeApplicationUsecase} from 'src/infrastructure/service-container';

export const removePortailApplicationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await removeApplicationUsecase.remove(<ApplicationId>req.params.id);
    setTimeout(() => {
      res.redirect('/');
    }, 100);
  } catch (error) {
    next(error);
  }
};
