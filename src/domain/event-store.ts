import {Event} from 'src/domain/event';

export interface EventStore {
  append(event: Event): Promise<void>;

  listAggregateEvents<E extends Event>(
    aggregate: string,
    aggregateId: string
  ): Promise<E[]>;
}
