import {Request, Response} from 'express';
import {UserEmail} from 'src/domain/application-management/user';
import {applicationProjectionRepository} from 'src/infrastructure/service-container';

export const listApplications = async (req: Request, res: Response) => {
  const applications = await applicationProjectionRepository.findAllByUserEmail(
    'croute' as UserEmail
  );

  res.render('index', {applications, user: {email: 'croute@lol.fr'}});
};
