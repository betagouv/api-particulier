import {Request, Response} from 'express';
import {ApplicationId} from 'src/domain/application-id';
import {
  applicationRepository,
  subscribeUserUsecase,
} from 'src/infrastructure/service-container';

export const listApplications = async (req: Request, res: Response) => {
  const applications = await applicationRepository.findAll();

  res.render('admin/index', {applications, user: req.user});
};

export const applicationDetails = async (req: Request, res: Response) => {
  const application = await applicationRepository.findById(
    req.params.id as ApplicationId
  );

  res.render('admin/application-details', {application, user: req.user});
};

export const addUserToApplication = async (req: Request, res: Response) => {
  const email = req.body.email;
  const id = req.params.id;

  await subscribeUserUsecase.subscribe(email, <ApplicationId>id);

  res.redirect(`/admin/applications/${id}`);
};
