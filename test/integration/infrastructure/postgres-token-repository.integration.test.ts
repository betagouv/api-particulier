import {expect} from 'chai';
import {ApplicationId} from 'src/domain/application-id';
import {Application} from 'src/domain/application-management/entities/application';
import {TokenValue} from 'src/domain/token-value';
import {PostgresApplicationRepository} from 'src/infrastructure/repositories/postgres-application.repository';
import {PostgresTokenRepository} from 'src/infrastructure/repositories/postgres-token.repository';
import {pgPool} from 'test/integration/config';

describe('The postgres token repository', () => {
  it('can retrieve tokens', async () => {
    const postgresRepository = new PostgresApplicationRepository(pgPool);
    const tokenRepository = new PostgresTokenRepository(pgPool);

    const application = new Application(
      '70156b20-dce3-49d7-8a64-4294d9d81746' as ApplicationId,
      'croute',
      new Date(),
      '0',
      {
        value: 'value' as TokenValue,
        scopes: ['cnaf_adresse', 'dgfip_adresse'],
        subscriptions: ['CNAF', 'DGFIP'],
      },
      []
    );

    await postgresRepository.save(application);

    const candidate = await tokenRepository.findByTokenValue(
      application.token.value
    );

    expect(candidate).to.deep.include({
      application: {
        id: application.id,
        name: application.name,
      },
      value: 'value',
      scopes: ['cnaf_adresse', 'dgfip_adresse'],
      subscriptions: ['CNAF', 'DGFIP'],
    });
  });
});
