import {expect} from 'chai';
import {ApplicationId} from 'src/domain/application-id';
import {Application} from 'src/domain/application-management/entities/application';
import {TokenValue} from 'src/domain/token-value';
import {PostgresApplicationRepository} from 'src/infrastructure/repositories/postgres-application.repository';
import {pgPool} from 'test/integration/config';

describe('The postgres application repository', () => {
  it('can retrieve applications by token value', async () => {
    const postgresRepository = new PostgresApplicationRepository(pgPool);

    const application = new Application(
      '050dc316-6ab4-45b4-8488-e05b609566f1' as ApplicationId,
      'croute',
      new Date(),
      '0',
      {
        value: 'my-token-value' as TokenValue,
        scopes: ['cnaf_adresse', 'dgfip_adresse'],
        subscriptions: ['CNAF', 'DGFIP'],
      },
      []
    );

    await postgresRepository.save(application);

    const candidate = await postgresRepository.findByTokenValue(
      application.token.value
    );

    expect(candidate).to.deep.include({
      id: application.id,
      name: application.name,
      token: {
        value: 'my-token-value',
        scopes: ['cnaf_adresse', 'dgfip_adresse'],
        subscriptions: ['CNAF', 'DGFIP'],
      },
    });
  });
});
