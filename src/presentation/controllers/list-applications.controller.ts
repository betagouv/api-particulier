import {Request, Response} from 'express';
import {applicationProjectionRepository} from 'src/infrastructure/service-container';

export const listApplications = async (req: Request, res: Response) => {
  const applications = await applicationProjectionRepository.findAllByUserEmail(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.user.email
  );

  res.render('index', {applications, user: req.user});
};
