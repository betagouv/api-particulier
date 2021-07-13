// eslint-disable-next-line node/no-unpublished-import
import {mock} from 'jest-mock-extended';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenWithHashRetry} from 'src/domain/data-fetching/repositories/token-with-hash-retry.repository';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {TokenValue} from 'src/domain/token-value';

describe('The hash retry token repository', () => {
  const decoratedRepository = mock<TokenRepository>();
  const repository = new TokenWithHashRetry(decoratedRepository);
  const clearTokenValue = 'croute' as TokenValue;

  it('uses the API Particulier legacy hash method', () => {
    const computedHashedValue = repository.hashTokenValue(clearTokenValue);

    expect(computedHashedValue).toEqual(
      '7deee79e146c2c457a4d31b07ddec4e607bf277b4c3de80ceb96080b07e36fabb35a6f170ebdf8a567755105dd7753c6ecadfff670fb48de893dc375fb347afd'
    );
  });

  it('does not retry when clear value leads to a match', async () => {
    const match = Symbol('Clear value match') as unknown as Token;
    decoratedRepository.findByTokenValue.mockResolvedValue(match);

    await repository.findByTokenValue(clearTokenValue);

    expect(decoratedRepository.findByTokenValue).toHaveBeenCalledTimes(1);
    expect(decoratedRepository.findByTokenValue.mock.calls[0][0]).toEqual(
      clearTokenValue
    );
  });

  it('does retry when a token not found error is thrown', async () => {
    decoratedRepository.findByTokenValue.mockRejectedValueOnce(
      new TokenNotFoundError(clearTokenValue)
    );

    await repository.findByTokenValue(clearTokenValue);

    expect(decoratedRepository.findByTokenValue).toHaveBeenCalledTimes(2);
    expect(decoratedRepository.findByTokenValue.mock.calls[0][0]).toEqual(
      clearTokenValue
    );
    expect(decoratedRepository.findByTokenValue.mock.calls[1][0]).toEqual(
      repository.hashTokenValue(clearTokenValue)
    );
  });

  it('throws the underlying error when it is not a token not found error', () => {
    const error = new Error('Cannot read property yolo of undefined');

    decoratedRepository.findByTokenValue.mockRejectedValueOnce(error);

    expect(repository.findByTokenValue(clearTokenValue)).rejects.toEqual(error);
  });

  it('calls the decorated save method upon saving', () => {
    const tokenToSave = Symbol('Token to save') as unknown as Token;

    repository.save(tokenToSave);

    expect(decoratedRepository.save).toHaveBeenCalledTimes(1);
    expect(decoratedRepository.save).toHaveBeenCalledWith(tokenToSave);
  });
});
