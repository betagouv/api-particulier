import {TokenConsumed} from 'src/domain/data-fetching/events/token-consumed.event';
import {TokenNotFound} from 'src/domain/data-fetching/events/token-not-found.event';
import {Event} from 'src/domain/event';
import {redisConnection} from 'src/infrastructure/configuration/redis';
import {BullWorker} from 'src/infrastructure/event-bus/bull.worker';
import {
  repositoryFeeder,
  entryProjector,
} from 'src/infrastructure/service-container';

new BullWorker(redisConnection, {
  [TokenNotFound.name]: [
    (event: Event) => {
      return repositoryFeeder.onTokenNotFound.call(
        repositoryFeeder,
        event as TokenNotFound
      );
    },
  ],
  [TokenConsumed.name]: [
    (event: Event) => {
      return entryProjector.onTokenConsumed.call(
        entryProjector,
        event as TokenConsumed
      );
    },
  ],
});
