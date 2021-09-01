import {expect} from 'chai';
import {ApplicationId} from 'src/domain/application-id';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenValue} from 'src/domain/token-value';
import {RedisTokenRepository} from 'src/infrastructure/repositories/redis-token.repository';
import {redisConnection} from 'test/integration/config';

describe('The redis token repository', () => {
  const repository = new RedisTokenRepository(redisConnection);
  const token = new Token(
    'croute' as ApplicationId,
    'value' as TokenValue,
    ['cnaf_adresse', 'dgfip_adresse'],
    ['CNAF', 'DGFIP']
  );

  it('saves tokens and finds them later on', async () => {
    await repository.save(token);

    const foundToken = await repository.findByTokenValue(token.value);

    expect(foundToken).to.deep.equal(token);
  });

  it('deletes tokens by application id', async () => {
    await repository.save(token);

    await repository.removeByApplicationId(token.applicationId);
  });
});
