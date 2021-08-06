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
    const req = {} as unknown as Request;
    const res = stubInterface<Response>();
    const next = stub();

    await middleware(req, res, next);

    expect(next).to.have.been.calledWithMatch(sinon.match.instanceOf(ZodError));
  });

  it('passes when everything is ok', async () => {
    const req = {
      query: {
        yolo: 'croute',
      },
    } as unknown as Request;
    const res = stubInterface<Response>();
    const next = stub();

    await middleware(req, res, next);

    expect(next).to.have.been.calledOnceWithExactly();
  });

  it('checks in the request body if needed', async () => {
    const bodyMiddleware = inputValidationMiddlewareBuilder(
      z.object({
        yolo: z.string(),
      }),
      'body'
    );
    const req = {
      body: {
        yolo: 'croute',
      },
    } as unknown as Request;

    const res = stubInterface<Response>();
    const next = stub();

    await bodyMiddleware(req, res, next);

    expect(next).to.have.been.calledOnceWithExactly();
  });

  it('sets the parsing result in the res.locals.input variable', async () => {
    const req = {
      query: {
        yolo: 'croute',
      },
    } as unknown as Request;

    const res = stubInterface<Response>();
    const next = stub();

    await middleware(req, res, next);

    expect(res.locals.input).to.deep.equal(req.query);
  });
});
