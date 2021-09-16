import {Request, Response} from 'express';
import {applicationProjectionRepository} from 'src/infrastructure/service-container';

export const listUserApplications = async (req: Request, res: Response) => {
  const applications = await applicationProjectionRepository.findAllByUserEmail(
    req.user!.email
  );

  res.render('index', {applications, user: req.user});
};
