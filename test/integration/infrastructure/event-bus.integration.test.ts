// eslint-disable-next-line node/no-unpublished-import
import {expect} from 'chai';
import {ApplicationId} from 'src/domain/application-id';
import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {Event} from 'src/domain/event';
import {TokenValue} from 'src/domain/token-value';
import {BullEventBus} from 'src/infrastructure/event-bus/bull.event-bus';
import {BullWorker} from 'src/infrastructure/event-bus/bull.worker';
import {redisConnection} from 'test/integration/config';

describe('The event bus', () => {
  const eventBus = new BullEventBus(redisConnection);
  let worker: BullWorker;

  after(async () => {
    await worker.close();
  });

  it('publishes events that are consumed by the worker', done => {
    worker = new BullWorker(redisConnection, {
      [ApplicationCreated.name]: [
        (event: Event) => {
          expect(event.aggregateId).to.exist;
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
