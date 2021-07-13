import * as IORedis from 'ioredis';
import {ApplicationId} from 'src/domain/application-id';
import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {Event} from 'src/domain/event';
import {EventBus} from 'src/domain/event-bus';
import {TokenValue} from 'src/domain/token-value';
import {BullEventBus} from 'src/infrastructure/event-bus/bull.event-bus';
import {BullWorker} from 'src/infrastructure/event-bus/bull.worker';

describe('The event bus', () => {
  let eventBus: EventBus;
  let connection: IORedis.Redis;
  let worker: BullWorker;

  beforeAll(async () => {
    connection = new IORedis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    });
    eventBus = new BullEventBus(connection);
  });

  afterAll(async () => {
    await worker.close();
    await connection.disconnect(false);
  });

  it('publishes events that are consumed by the worker', done => {
    worker = new BullWorker(connection, {
      [ApplicationCreated.name]: [
        (event: Event) => {
          expect(event.aggregateId).toBeDefined();
          done();
        },
      ],
    });

    eventBus.publish(
      new ApplicationCreated(
        'croute' as ApplicationId,
        new Date(),
        'La croute',
        '4',
        [],
        [],
        [],
        'token' as TokenValue
      )
    );
  });
});
