import {expect} from 'chai';
import {Request, Response} from 'express';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {TooManyCredentialsError} from 'src/domain/data-fetching/errors/too-many-credentials.error';
import {credentialsValidationMiddleware} from 'src/presentation/middlewares/credentials-validation.middleware';
import sinon, {stubInterface} from 'ts-sinon';

describe('The Api key validation middleware', () => {
  it('checks for any credential presence', async () => {
    const req = stubInterface<Request>();
    const res = stubInterface<Response>();
    const next = sinon.stub();

    req.header.returns(undefined);

    await credentialsValidationMiddleware(req, res, next);

    expect(next).to.have.been.calledWithMatch(
      sinon.match.instanceOf(TokenNotFoundError)
    );
  });

  it('checks if not both credential types are provided', async () => {
    const req = stubInterface<Request>();
    const res = stubInterface<Response>();
    const next = sinon.stub();

    req.header.callsFake((headerName: string) => {
      switch (headerName) {
        case 'Authorization':
          return 'Bearer croute';
        case 'X-Api-Key':
          return 'yolo';
        default:
          return;
      }
    });

    await credentialsValidationMiddleware(req, res, next);

    expect(next).to.have.been.calledWithMatch(
      sinon.match.instanceOf(TooManyCredentialsError)
    );
  });

  it('extracts the access token value in express res locals', async () => {
    const req = stubInterface<Request>();
    const res = stubInterface<Response>();
    const next = sinon.stub();
    const accessToken = 'yolooooo';

    req.header.onSecondCall().returns(`Bearer ${accessToken}`);

    await credentialsValidationMiddleware(req, res, next);

    expect(next).to.have.been.calledWithExactly();
    expect(res.locals.credentials.type).to.equal('access-token');
    expect(res.locals.credentials.tokenValue).to.equal(accessToken);
  });
});
