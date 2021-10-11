import {
  entryProjector,
  eventBus,
  postgresTokenProjector,
} from 'src/infrastructure/service-container';

export const routeEvents = () => {
  eventBus.onApplicationCreated(
    postgresTokenProjector.onApplicationCreated.bind(postgresTokenProjector)
  );

  eventBus.onTokenConsumed(entryProjector.onTokenConsumed.bind(entryProjector));

  eventBus.onApplicationRemoved(
    postgresTokenProjector.onApplicationRemoved.bind(postgresTokenProjector)
  );
};
