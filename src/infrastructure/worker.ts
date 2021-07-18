import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {ApplicationImported} from 'src/domain/application-management/events/application-imported.event';
import {TokenNotFound} from 'src/domain/data-fetching/events/token-not-found.event';
import {Event} from 'src/domain/event';
import {BullWorker} from 'src/infrastructure/event-bus/bull.worker';
import {
  redisConnection,
  mainTokenProjector,
  fallbackTokenProjector,
  repositoryFeeder,
} from 'src/infrastructure/service-container';

new BullWorker(redisConnection, {
  [ApplicationCreated.name]: [
    (event: Event) => {
      mainTokenProjector.onApplicationCreated.call(
        mainTokenProjector,
        event as ApplicationCreated
      );
    },
    (event: Event) => {
      fallbackTokenProjector.onApplicationCreated.call(
        fallbackTokenProjector,
        event as ApplicationCreated
      );
    },
  ],
  [ApplicationImported.name]: [
    (event: Event) => {
      mainTokenProjector.onApplicationImported.call(
        mainTokenProjector,
        event as ApplicationImported
      );
    },
    (event: Event) => {
      fallbackTokenProjector.onApplicationImported.call(
        fallbackTokenProjector,
        event as ApplicationImported
      );
    },
  ],
  [TokenNotFound.name]: [
    (event: Event) => {
      repositoryFeeder.onTokenNotFound.call(
        repositoryFeeder,
        event as TokenNotFound
      );
    },
  ],
});
