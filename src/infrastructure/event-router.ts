import {
  applicationProjector,
  entryProjector,
  eventBus,
  postgresTokenProjector,
} from 'src/infrastructure/service-container';

export const routeEvents = () => {
  eventBus.onApplicationCreated(
    postgresTokenProjector.onApplicationCreated.bind(postgresTokenProjector)
  );
  eventBus.onApplicationCreated(
    applicationProjector.onApplicationCreated.bind(applicationProjector)
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

  eventBus.onTokenConsumed(entryProjector.onTokenConsumed.bind(entryProjector));

  eventBus.onApplicationRemoved(
    applicationProjector.onApplicationRemoved.bind(applicationProjector)
  );

  eventBus.onApplicationRemoved(
    postgresTokenProjector.onApplicationRemoved.bind(postgresTokenProjector)
  );
};
