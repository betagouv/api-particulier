import {Event} from 'src/domain/event';

export interface EventStore {
  append(event: Event): Promise<void>;

  listAggregateEvents(aggregate: string, aggregateId: string): Promise<Event[]>;

  listEvents(): Promise<Event[]>;
}
