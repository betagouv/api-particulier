import {Request, Response} from 'express';
import {CreateApplicationDto} from 'src/domain/data-fetching/dtos/create-application.dto';
import {AnyScope, unifiedScopesConfiguration} from 'src/domain/scopes';
import {createApplicationUsecase} from 'src/infrastructure/service-container';
import {z} from 'zod';

const createUserApplicationDtoSchema = z
  .object({
    name: z.string().nonempty(),
    scopes: z
      .object(
        Object.keys(unifiedScopesConfiguration).reduce((acc, key) => {
          return {
            ...acc,
            [key]: z.literal('on'),
          };
        }, {})
      )
      .partial(),
  })
  .transform(obj => ({
    name: obj.name,
    scopes: Object.keys(obj.scopes),
  }));

export const createPortailApplicationController = async (
  req: Request,
  res: Response
) => {
  const inputValidation = await createUserApplicationDtoSchema.safeParseAsync(
    req.body
  );
  const clientHasJsEnabled = req
    .get('Accept')
    ?.includes('text/vnd.turbo-stream.html');

  if (!inputValidation.success) {
    if (clientHasJsEnabled) {
      res.status(422).render('partials/new-application', {
        errors: inputValidation.error.format(),
        input: req.body,
      });
      return;
    }
    res.redirect('/');
    return;
  }

  await createApplicationUsecase.createApplication(
    new CreateApplicationDto(
      inputValidation.data.name,
      '0',
      <AnyScope[]>inputValidation.data.scopes,
      [req.user!.email]
    )
  );

  setTimeout(() => {
    res.redirect('/');
  }, 300);
};
