import {configureScope} from '@sentry/node';
import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {ApplicationImported} from 'src/domain/application-management/events/application-imported.event';
import {ResponseSent} from 'src/domain/data-fetching/events/response-sent.event';
import {TokenNotFound} from 'src/domain/data-fetching/events/token-not-found.event';
import {Event} from 'src/domain/event';
import {BullWorker} from 'src/infrastructure/event-bus/bull.worker';
import {
  redisConnection,
  redisTokenProjector,
  postgresTokenProjector,
  repositoryFeeder,
  qualityMonitor,
} from 'src/infrastructure/service-container';

new BullWorker(redisConnection, {
  [ApplicationCreated.name]: [
    (event: Event) => {
      return redisTokenProjector.onApplicationCreated.call(
        redisTokenProjector,
        event as ApplicationCreated
      );
    },
    (event: Event) => {
      return postgresTokenProjector.onApplicationCreated.call(
        postgresTokenProjector,
        event as ApplicationCreated
      );
    },
  ],
  [ApplicationImported.name]: [
    (event: Event) => {
      return redisTokenProjector.onApplicationImported.call(
        redisTokenProjector,
        event as ApplicationImported
      );
    },
    (event: Event) => {
      return postgresTokenProjector.onApplicationImported.call(
        postgresTokenProjector,
        event as ApplicationImported
      );
    },
  ],
  [TokenNotFound.name]: [
    (event: Event) => {
      return repositoryFeeder.onTokenNotFound.call(
        repositoryFeeder,
        event as TokenNotFound
      );
    },
  ],
  [ResponseSent.name]: [
    (event: Event) => {
      configureScope(scope => {
        scope.setUser({id: (event as ResponseSent).aggregateId});
      });
      return qualityMonitor.onResponseSent.call(
        qualityMonitor,
        event as ResponseSent
      );
    },
  ],
});
