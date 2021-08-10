import {Request, Response, NextFunction} from 'express';

export const redirectToPortailDomain = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.protocol + '://' + req.header('host') !== process.env.BASE_URL) {
    res.redirect(process.env.BASE_URL!);
  }
  next();
};
