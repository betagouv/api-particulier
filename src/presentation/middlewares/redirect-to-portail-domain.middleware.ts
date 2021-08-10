import {Request, Response, NextFunction} from 'express';

export const redirectToPortailDomain = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // eslint-disable-next-line node/no-unsupported-features/node-builtins
  if (req.hostname !== new URL(process.env.BASE_URL!).hostname) {
    res.redirect(process.env.BASE_URL!);
  }
  next();
};
