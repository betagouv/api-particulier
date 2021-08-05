import {expect} from 'chai';
import {ApplicationId} from 'src/domain/application-id';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {TokenNotFound} from 'src/domain/data-fetching/events/token-not-found.event';
import {Token} from 'src/domain/data-fetching/projections/token';
import {RepositoryFeeder} from 'src/domain/data-fetching/repository-feeder';
import {TokenValue} from 'src/domain/token-value';
import {PostgresTokenRepository} from 'src/infrastructure/repositories/postgres-token.repository';
import {RedisTokenRepository} from 'src/infrastructure/repositories/redis-token.repository';
import {pgPool, redisConnection} from 'test/integration/config';

describe('The token feeder', () => {
  const redisRepository = new RedisTokenRepository(redisConnection);
  const postgresRepository = new PostgresTokenRepository(pgPool);
  const token = new Token(
    '70156b20-dce3-49d7-8a64-4294d9d81746' as ApplicationId,
    'token value' as TokenValue,
    ['cnaf_adresse'],
    ['CNAF']
  );

  before(async () => {
    await postgresRepository.save(token);
    await redisConnection.del('TOKEN_VALUE-' + token.value);
  });

  it('updates the redis repository when a token is missing', async () => {
    const repositoryFeeder = new RepositoryFeeder(
      redisRepository,
      postgresRepository
    );

    await expect(
      redisRepository.findByTokenValue(token.value)
    ).to.be.rejectedWith(TokenNotFoundError);

    await repositoryFeeder.onTokenNotFound(
      new TokenNotFound(token.applicationId, new Date(), token.value)
    );

    const foundToken = await redisRepository.findByTokenValue(token.value);

    expect(foundToken).to.deep.equal(token);
  });
});
