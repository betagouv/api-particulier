import {AggregateEvent} from 'src/domain/aggregate-event';

export interface EventStore {
  append(event: AggregateEvent): Promise<void>;

  listAggregateEvents(
    aggregate: string,
    aggregateId: string
  ): Promise<AggregateEvent[]>;

  listEvents(): Promise<AggregateEvent[]>;
}
