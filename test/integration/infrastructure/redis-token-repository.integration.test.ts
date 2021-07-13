import * as IORedis from 'ioredis';
import {ApplicationId} from 'src/domain/application-id';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {TokenValue} from 'src/domain/token-value';
import {RedisTokenRepository} from 'src/infrastructure/repositories/redis-token.repository';

describe('The redis token repository', () => {
  let repository: TokenRepository;
  let connection: IORedis.Redis;

  beforeAll(async () => {
    connection = new IORedis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    });
    repository = new RedisTokenRepository(connection);
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it('saves tokens and finds them later on', async () => {
    const token = new Token(
      'croute' as ApplicationId,
      'value' as TokenValue,
      ['cnaf_adresse', 'dgfip_adresse'],
      ['CNAF', 'DGFIP']
    );

    await repository.save(token);

    const foundToken = await repository.findByTokenValue(token.value);

    expect(foundToken).toEqual(token);
  });
});
