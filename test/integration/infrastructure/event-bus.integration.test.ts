import {ApplicationId} from 'src/domain/application-id';
import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {Event} from 'src/domain/event';
import {TokenValue} from 'src/domain/token-value';
import {
  applicationEventQueue,
  BullEventBus,
  tokenEventQueue,
} from 'src/infrastructure/event-bus/bull.event-bus';
import {BullWorker} from 'src/infrastructure/event-bus/bull.worker';

describe('The event bus', () => {
  let worker: BullWorker;
  beforeAll(async () => {
    await applicationEventQueue.drain();
    await tokenEventQueue.drain();
  });

  afterAll(async () => {
    await worker.close();
    await applicationEventQueue.disconnect();
    await tokenEventQueue.disconnect();
  });

  it('publishes events that are consumed by the worker', done => {
    const eventBus = new BullEventBus();

    worker = new BullWorker({
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
