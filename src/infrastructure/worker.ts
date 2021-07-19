import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {ApplicationImported} from 'src/domain/application-management/events/application-imported.event';
import {TokenNotFound} from 'src/domain/data-fetching/events/token-not-found.event';
import {Event} from 'src/domain/event';
import {BullWorker} from 'src/infrastructure/event-bus/bull.worker';
import {
  redisConnection,
  redisTokenProjector,
  postgresTokenProjector,
  repositoryFeeder,
} from 'src/infrastructure/service-container';

new BullWorker(redisConnection, {
  [ApplicationCreated.name]: [
    (event: Event) => {
      redisTokenProjector.onApplicationCreated.call(
        redisTokenProjector,
        event as ApplicationCreated
      );
    },
    (event: Event) => {
      postgresTokenProjector.onApplicationCreated.call(
        postgresTokenProjector,
        event as ApplicationCreated
      );
    },
  ],
  [ApplicationImported.name]: [
    (event: Event) => {
      redisTokenProjector.onApplicationImported.call(
        redisTokenProjector,
        event as ApplicationImported
      );
    },
    (event: Event) => {
      postgresTokenProjector.onApplicationImported.call(
        postgresTokenProjector,
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
