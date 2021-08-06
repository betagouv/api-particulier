import {expect} from 'chai';
import {Request, Response} from 'express';
import {stub} from 'sinon';
import {createApplicationValidationMiddleware} from 'src/presentation/middlewares/create-application-validation.middleware';
import {stubInterface} from 'ts-sinon';

describe('The create application validation middleware', () => {
  const middleware = createApplicationValidationMiddleware;
  const req = stubInterface<Request>();
  const res = stubInterface<Response>();
  const next = stub();

  it('groups user emails', async () => {
    const authorEmail = 'georges@moustaki.fr';
    const technicalContactEmail = 'technique@moustaki.fr';
    req.body = {
      name: 'Croute',
      author_email: authorEmail,
      data_pass_id: '12345',
      technical_contact_email: technicalContactEmail,
      scopes: ['yolo', 'croute'],
    };

    await middleware(req, res, next);

    expect(next).to.have.been.calledWithExactly();
    expect(res.locals.input.userEmails).to.deep.equal([
      technicalContactEmail,
      authorEmail,
    ]);
  });

  it('removes email duplicates', async () => {
    const technicalContactEmail = 'technique@moustaki.fr';
    req.body = {
      name: 'Croute',
      author_email: technicalContactEmail,
      data_pass_id: '12345',
      technical_contact_email: technicalContactEmail,
      scopes: ['yolo', 'croute'],
    };

    await middleware(req, res, next);

    expect(res.locals.input.userEmails).to.deep.equal([technicalContactEmail]);
  });
});
