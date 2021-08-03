// eslint-disable-next-line node/no-unpublished-import
import {expect} from 'chai';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenRepositoryWithHashRetry} from 'src/domain/data-fetching/repositories/token-with-hash-retry.repository';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {TokenValue} from 'src/domain/token-value';
// eslint-disable-next-line node/no-unpublished-import
import {stubInterface} from 'ts-sinon';

describe('The hash retry token repository', () => {
  const decoratedRepository = stubInterface<TokenRepository>();
  const repository = new TokenRepositoryWithHashRetry(decoratedRepository);
  const clearTokenValue = 'croute' as TokenValue;

  it('uses the API Particulier legacy hash method', () => {
    const computedHashedValue = repository.hashTokenValue(clearTokenValue);

    expect(computedHashedValue).to.equal(
      '7deee79e146c2c457a4d31b07ddec4e607bf277b4c3de80ceb96080b07e36fabb35a6f170ebdf8a567755105dd7753c6ecadfff670fb48de893dc375fb347afd'
    );
  });

  it('does not retry when clear value leads to a match', async () => {
    const match = Symbol('Clear value match') as unknown as Token;
    decoratedRepository.findByTokenValue.resolves(match);

    await repository.findByTokenValue(clearTokenValue);

    expect(
      decoratedRepository.findByTokenValue
    ).to.have.been.calledOnceWithExactly(clearTokenValue);
  });

  it('does retry when a token not found error is thrown', async () => {
    decoratedRepository.findByTokenValue.reset();
    decoratedRepository.findByTokenValue.rejects(
      new TokenNotFoundError(clearTokenValue)
    );

    await expect(repository.findByTokenValue(clearTokenValue)).to.have.rejected;

    expect(decoratedRepository.findByTokenValue).to.have.been.calledTwice;
    expect(
      decoratedRepository.findByTokenValue.getCall(0).args[0]
    ).to.deep.equal(clearTokenValue);
    expect(
      decoratedRepository.findByTokenValue.getCall(1).args[0]
    ).to.deep.equal(repository.hashTokenValue(clearTokenValue));
  });

  it('throws the underlying error when it is not a token not found error', async () => {
    const error = new Error('Cannot read property yolo of undefined');

    decoratedRepository.findByTokenValue.rejects(error);

    await expect(
      repository.findByTokenValue(clearTokenValue)
    ).to.have.rejectedWith(error);
  });

  it('calls the decorated save method upon saving', () => {
    const tokenToSave = Symbol('Token to save') as unknown as Token;

    repository.save(tokenToSave);

    expect(decoratedRepository.save).to.have.been.calledOnceWith(tokenToSave);
  });
});
