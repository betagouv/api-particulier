import {expect} from 'chai';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {TokenCache} from 'src/domain/data-fetching/token.cache';
import {TokenValue} from 'src/domain/token-value';
import {stubInterface} from 'ts-sinon';

describe('The token cache', () => {
  const tokenRepository = stubInterface<TokenRepository>();
  const tokenCache = new TokenCache(tokenRepository);
  const firstToken = Symbol('croute') as unknown as Token;
  const secondToken = Symbol('yolo') as unknown as Token;

  it('caches token forever', async () => {
    tokenRepository.findByTokenValue.resolves(firstToken);

    let foundToken = await tokenCache.findByTokenValue('token' as TokenValue);
    expect(foundToken).to.deep.equal(firstToken);

    tokenRepository.findByTokenValue.resolves(secondToken);
    foundToken = await tokenCache.findByTokenValue('token' as TokenValue);
    expect(foundToken).to.deep.equal(firstToken);

    tokenRepository.findByTokenValue.rejects(new Error('End of the world'));
    foundToken = await tokenCache.findByTokenValue('token' as TokenValue);
    expect(foundToken).to.deep.equal(firstToken);
  });

  it('can be cleared', async () => {
    tokenRepository.findByTokenValue.resolves(firstToken);

    let foundToken = await tokenCache.findByTokenValue('token' as TokenValue);
    expect(foundToken).to.deep.equal(firstToken);

    tokenRepository.findByTokenValue.resolves(secondToken);
    foundToken = await tokenCache.findByTokenValue('token' as TokenValue);
    expect(foundToken).to.deep.equal(firstToken);

    tokenCache.clear();
    foundToken = await tokenCache.findByTokenValue('token' as TokenValue);
    expect(foundToken).to.deep.equal(secondToken);
  });
});
