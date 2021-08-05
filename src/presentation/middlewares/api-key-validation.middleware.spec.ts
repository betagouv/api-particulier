import {expect} from 'chai';
import {Request, Response} from 'express';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {apiKeyValidationMiddleware} from 'src/presentation/middlewares/api-key-validation.middleware';
import sinon, {stubInterface} from 'ts-sinon';

describe('The Api key validation middleware', () => {
  it('checks for api key presence', async () => {
    const req = stubInterface<Request>();
    const res = stubInterface<Response>();
    const next = sinon.stub();

    req.header.returns(undefined);

    await apiKeyValidationMiddleware(req, res, next);

    expect(next).to.have.been.calledWithMatch(
      sinon.match.instanceOf(TokenNotFoundError)
    );
  });
});
