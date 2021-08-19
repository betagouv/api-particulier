import * as sinon from 'ts-sinon';
import {expect} from 'chai';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {TokenNotFound} from 'src/domain/data-fetching/events/token-not-found.event';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {RepositoryFeeder} from 'src/domain/data-fetching/repository-feeder';
import {TokenValue} from 'src/domain/token-value';

describe('The token feeder', () => {
  const mainRepository = sinon.stubInterface<TokenRepository>();
  const fallbackRepository = sinon.stubInterface<TokenRepository>();
  const repositoryFeeder = new RepositoryFeeder(
    mainRepository,
    fallbackRepository
  );

  describe('calls the fallback repository when token is not found', () => {
    it('and does nothing if token is not found in fallback repo', async () => {
      const tokenValue = 'token value' as TokenValue;
      const notFoundEvent = new TokenNotFound(tokenValue);

      fallbackRepository.findByTokenValue.rejects(
        new TokenNotFoundError(tokenValue)
      );

      await repositoryFeeder.onTokenNotFound(notFoundEvent);

      expect(fallbackRepository.findByTokenValue).to.have.been.calledWith(
        tokenValue
      );
      expect(mainRepository.save).to.have.not.been.called;
    });

    it('and saves it in the main repo when fallback repo finds one', async () => {
      const tokenValue = 'token value' as TokenValue;
      const foundToken = Symbol('Found token') as unknown as Token;
      const notFoundEvent = new TokenNotFound(tokenValue);

      fallbackRepository.findByTokenValue.resolves(foundToken);

      await repositoryFeeder.onTokenNotFound(notFoundEvent);

      expect(fallbackRepository.findByTokenValue).to.have.been.calledWith(
        tokenValue
      );
      expect(mainRepository.save).to.have.been.calledWith(foundToken);
    });

    it('and throw an error if fallback repo throws an error different from token not found', async () => {
      const tokenValue = 'token value' as TokenValue;
      const notFoundEvent = new TokenNotFound(tokenValue);

      fallbackRepository.findByTokenValue.rejects(
        new Error('La barbe de la femme à Georges Moustaki')
      );

      await expect(repositoryFeeder.onTokenNotFound(notFoundEvent)).to
        .eventually.have.rejected;
    });
  });
});
