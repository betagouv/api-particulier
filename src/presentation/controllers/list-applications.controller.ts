import {Request, Response} from 'express';
import {applicationProjectionRepository} from 'src/infrastructure/service-container';

export const listApplications = async (req: Request, res: Response) => {
  const applications = await applicationProjectionRepository.findAll();

  res.render('admin', {applications, user: req.user});
};
