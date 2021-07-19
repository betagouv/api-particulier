import {ApplicationId} from 'src/domain/application-id';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenValue} from 'src/domain/token-value';
import {PostgresTokenRepository} from 'src/infrastructure/repositories/postgres-token.repository';
import {pgClient} from 'test/integration/config';

describe('The postgres token repository', () => {
  beforeAll(async () => {
    await pgClient.connect();
  });

  afterAll(async () => {
    await pgClient.end();
  });

  it('can save and retrieve tokens', async () => {
    const repository = new PostgresTokenRepository(pgClient);

    const token = new Token(
      '70156b20-dce3-49d7-8a64-4294d9d81746' as ApplicationId,
      'value' as TokenValue,
      ['cnaf_adresse', 'dgfip_adresse'],
      ['CNAF', 'DGFIP']
    );

    await repository.save(token);

    const candidate = await repository.findByTokenValue(token.value);

    expect(candidate).toEqual(token);
  });
});
