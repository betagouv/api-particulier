import {Request, Response} from 'express';
import {ApplicationId} from 'src/domain/application-id';
import {applicationProjectionRepository} from 'src/infrastructure/service-container';

export const listApplications = async (req: Request, res: Response) => {
  const applications = await applicationProjectionRepository.findAll();

  res.render('admin/index', {applications, user: req.user});
};

export const applicationDetails = async (req: Request, res: Response) => {
  const application = await applicationProjectionRepository.findById(
    req.params.id as ApplicationId
  );

  res.render('admin/application-details', {application, user: req.user});
};
