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

  if (!inputValidation.success) {
    if (req.accepts('text/vnd.turbo-stream.html')) {
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
      res.locals.input.name,
      '0',
      <AnyScope[]>res.locals.input.scopes,
      [req.user!.email]
    )
  );
  setTimeout(() => {
    res.redirect('/');
  }, 100);
};
