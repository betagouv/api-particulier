import {expect} from 'chai';
import {Request, Response} from 'express';
import {stub} from 'sinon';
import {UserEmail} from 'src/domain/application-management/user';
import {isAdminMiddleware} from 'src/presentation/middlewares/is-admin.middleware';
import {stubInterface} from 'ts-sinon';

describe('The admin checker middleware', () => {
  const adminEmail = <UserEmail>'georges@moustaki.fr';
  process.env.ADMIN_USERS = adminEmail;

  it('calls next when the logged in user is an admin', () => {
    const res = stubInterface<Response>();
    const next = stub();
    const req = <Request>{
      user: {
        email: adminEmail,
        email_verified: true,
      },
    };

    isAdminMiddleware(req, res, next);

    expect(next).to.have.been.calledOnceWithExactly();
  });

  it('returns a 403 when the logged in user is not an admin', () => {
    const res = stubInterface<Response>();
    const next = stub();
    const req = <Request>{
      user: {
        email: 'jean@lol.fr',
        email_verified: true,
      },
    };
    res.status.returnsThis();

    isAdminMiddleware(req, res, next);

    expect(next).not.to.have.been.called;
    expect(res.status).to.have.been.calledWith(403);
  });

  it('returns a 403 when there is no logged in user', () => {
    const res = stubInterface<Response>();
    const next = stub();
    const req = <Request>{};
    res.status.returnsThis();

    isAdminMiddleware(req, res, next);

    expect(next).not.to.have.been.called;
    expect(res.status).to.have.been.calledWith(403);
  });
});
