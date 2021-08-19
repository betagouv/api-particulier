import {Event} from 'src/domain/event';

export interface AggregateEvent extends Event {
  readonly aggregateId: string;
  readonly date: Date;
}
