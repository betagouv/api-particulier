import {expect} from 'chai';
import {Request, Response} from 'express';
import {z, ZodError} from 'zod';
import {inputValidationMiddlewareBuilder} from 'src/presentation/middlewares/input-validation.middleware';
import sinon, {stubInterface} from 'ts-sinon';
import {stub} from 'sinon';

describe('The input validation middleware', () => {
  const middleware = inputValidationMiddlewareBuilder(
    z.object({
      yolo: z.string(),
    })
  );

  it('checks for input correctness', async () => {
    const req = {
      header: stub().returns('The api key'),
    } as unknown as Request;
    const res = stubInterface<Response>();
    const next = stub();

    await middleware(req, res, next);

    expect(next).to.have.been.calledWithMatch(sinon.match.instanceOf(ZodError));
  });

  it('passes when everything is ok', async () => {
    const req = {
      header: stub().returns('The api key'),
      query: {
        yolo: 'croute',
      },
    } as unknown as Request;
    const res = stubInterface<Response>();
    const next = stub();

    await middleware(req, res, next);

    expect(next).to.have.been.calledOnceWithExactly();
  });
});
