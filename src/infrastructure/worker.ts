import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {ApplicationImported} from 'src/domain/application-management/events/application-imported.event';
import {Event} from 'src/domain/event';
import {BullWorker} from 'src/infrastructure/event-bus/bull.worker';
import {
  redisConnection,
  tokenProjector,
} from 'src/infrastructure/service-container';

new BullWorker(redisConnection, {
  [ApplicationCreated.name]: [
    (event: Event) => {
      tokenProjector.onApplicationCreated.call(
        tokenProjector,
        event as ApplicationCreated
      );
    },
  ],
  [ApplicationImported.name]: [
    (event: Event) => {
      tokenProjector.onApplicationImported.call(
        tokenProjector,
        event as ApplicationImported
      );
    },
  ],
});
