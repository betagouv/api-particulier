import {
  applicationProjector,
  entryProjector,
  eventBus2,
  postgresTokenProjector,
  redisTokenProjector,
  repositoryFeeder,
} from 'src/infrastructure/service-container';

export const routeEvents = () => {
  eventBus2.onApplicationCreated(
    redisTokenProjector.onApplicationCreated.bind(redisTokenProjector)
  );
  eventBus2.onApplicationCreated(
    postgresTokenProjector.onApplicationCreated.bind(postgresTokenProjector)
  );
  eventBus2.onApplicationCreated(
    applicationProjector.onApplicationCreated.bind(applicationProjector)
  );

  eventBus2.onApplicationImported(
    redisTokenProjector.onApplicationImported.bind(redisTokenProjector)
  );
  eventBus2.onApplicationImported(
    postgresTokenProjector.onApplicationImported.bind(postgresTokenProjector)
  );
  eventBus2.onApplicationImported(
    applicationProjector.onApplicationImported.bind(applicationProjector)
  );

  eventBus2.onUserSubscribed(
    applicationProjector.onUserSubscribed.bind(applicationProjector)
  );

  eventBus2.onTokenNotFound(
    repositoryFeeder.onTokenNotFound.bind(repositoryFeeder)
  );

  eventBus2.onTokenConsumed(
    entryProjector.onTokenConsumed.bind(entryProjector)
  );
};
