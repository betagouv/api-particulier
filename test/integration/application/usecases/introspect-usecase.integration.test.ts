// eslint-disable-next-line node/no-unpublished-import
import {expect} from 'chai';
import {IntrospectUsecase} from 'src/application/usecases/introspect.usecase';
import {ApplicationImported} from 'src/domain/application-management/events/application-imported.event';
import {ApplicationProjector} from 'src/domain/application-management/projectors/application-projection.projector';
import {UserEmail} from 'src/domain/application-management/user';
import {TokenProjector} from 'src/domain/data-fetching/projectors/token.projector';
import {Event} from 'src/domain/event';
import {TokenValue} from 'src/domain/token-value';
import {BullEventBus} from 'src/infrastructure/event-bus/bull.event-bus';
import {BullWorker} from 'src/infrastructure/event-bus/bull.worker';
import {PostgresApplicationProjectionRepository} from 'src/infrastructure/repositories/postgres-application-projection.repository';
import {PostgresTokenRepository} from 'src/infrastructure/repositories/postgres-token.repository';
import {RedisTokenRepository} from 'src/infrastructure/repositories/redis-token.repository';
import {UuidFactory} from 'src/infrastructure/uuid.factory';
import {pgPool, redisConnection} from 'test/integration/config';

describe('The introspect usecase', () => {
  const uuidFactory = new UuidFactory();
  const eventBus = new BullEventBus(redisConnection);
  const redisTokenRepository = new RedisTokenRepository(redisConnection);
  const postgresTokenRepository = new PostgresTokenRepository(pgPool);
  const redisTokenProjector = new TokenProjector(redisTokenRepository);
  const postgresTokenProjector = new TokenProjector(postgresTokenRepository);
  const applicationRepository = new PostgresApplicationProjectionRepository(
    pgPool
  );
  const applicationProjector = new ApplicationProjector(applicationRepository);
  const introspectUsecase = new IntrospectUsecase(
    applicationRepository,
    redisTokenRepository
  );
  let worker: BullWorker;

  after(async () => {
    await worker.close();
  });
  it('uses the application projections to return data', async () => {
    const tokenValue = 'token-value' as TokenValue;
    eventBus.publish(
      new ApplicationImported(
        uuidFactory.generateUuid(),
        new Date(),
        'Application de test',
        'datapass123',
        ['cnaf_adresse', 'dgfip_adresse'],
        ['CNAF', 'DGFIP'],
        ['georges@moustaki.fr' as UserEmail],
        [{createdOn: new Date(), value: tokenValue}]
      )
    );

    await new Promise(resolve => {
      worker = new BullWorker(redisConnection, {
        [ApplicationImported.name]: [
          async (event: Event) => {
            await redisTokenProjector.onApplicationImported.call(
              redisTokenProjector,
              event as ApplicationImported
            );
            await postgresTokenProjector.onApplicationImported.call(
              postgresTokenProjector,
              event as ApplicationImported
            );
            await applicationProjector.onApplicationImported.call(
              applicationProjector,
              event as ApplicationImported
            );
            resolve(undefined);
          },
        ],
      });
    });

    const introspectionResult = await introspectUsecase.introspectToken(
      tokenValue
    );

    expect(introspectionResult).to.exist;
  });
});
