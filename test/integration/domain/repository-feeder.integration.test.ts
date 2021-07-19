import * as IORedis from 'ioredis';
import {ApplicationId} from 'src/domain/application-id';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {TokenNotFound} from 'src/domain/data-fetching/events/token-not-found.event';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {RepositoryFeeder} from 'src/domain/data-fetching/repository-feeder';
import {TokenValue} from 'src/domain/token-value';
import {PostgresTokenRepository} from 'src/infrastructure/repositories/postgres-token.repository';
import {RedisTokenRepository} from 'src/infrastructure/repositories/redis-token.repository';
import {pgPool} from 'test/integration/config';

describe('The token feeder', () => {
  let redisRepository: TokenRepository;
  let postgresRepository: TokenRepository;
  let connection: IORedis.Redis;
  const token = new Token(
    '70156b20-dce3-49d7-8a64-4294d9d81746' as ApplicationId,
    'token value' as TokenValue,
    ['cnaf_adresse'],
    ['CNAF']
  );

  beforeAll(async () => {
    connection = new IORedis(process.env.REDIS_URL);
    redisRepository = new RedisTokenRepository(connection);
    postgresRepository = new PostgresTokenRepository(pgPool);

    await postgresRepository.save(token);
    await connection.del('TOKEN_VALUE-' + token.value);
  });

  afterAll(async () => {
    await connection.disconnect(false);
    await pgPool.end();
  });

  it('updates the redis repository when a token is missing', async () => {
    const repositoryFeeder = new RepositoryFeeder(
      redisRepository,
      postgresRepository
    );

    expect(async () => {
      await redisRepository.findByTokenValue(token.value);
    }).rejects.toBeInstanceOf(TokenNotFoundError);

    await repositoryFeeder.onTokenNotFound(
      new TokenNotFound(token.applicationId, new Date(), token.value)
    );

    const foundToken = await redisRepository.findByTokenValue(token.value);

    expect(foundToken).toEqual(token);
  });
});
