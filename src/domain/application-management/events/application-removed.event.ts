import {AggregateEvent} from 'src/domain/aggregate-event';

export class ApplicationRemoved implements AggregateEvent {
  constructor(readonly aggregateId: string, readonly date: Date) {}
}
