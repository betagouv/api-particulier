import {
  applicationProjector,
  entryProjector,
  eventBus,
  postgresTokenProjector,
  redisTokenProjector,
  repositoryFeeder,
} from 'src/infrastructure/service-container';

export const routeEvents = () => {
  eventBus.onApplicationCreated(
    redisTokenProjector.onApplicationCreated.bind(redisTokenProjector)
  );
  eventBus.onApplicationCreated(
    postgresTokenProjector.onApplicationCreated.bind(postgresTokenProjector)
  );
  eventBus.onApplicationCreated(
    applicationProjector.onApplicationCreated.bind(applicationProjector)
  );

  eventBus.onApplicationImported(
    redisTokenProjector.onApplicationImported.bind(redisTokenProjector)
  );
  eventBus.onApplicationImported(
    postgresTokenProjector.onApplicationImported.bind(postgresTokenProjector)
  );
  eventBus.onApplicationImported(
    applicationProjector.onApplicationImported.bind(applicationProjector)
  );

  eventBus.onUserSubscribed(
    applicationProjector.onUserSubscribed.bind(applicationProjector)
  );

  eventBus.onTokenNotFound(
    repositoryFeeder.onTokenNotFound.bind(repositoryFeeder)
  );

  eventBus.onTokenConsumed(entryProjector.onTokenConsumed.bind(entryProjector));
};
