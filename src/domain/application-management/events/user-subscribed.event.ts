import {AggregateEvent} from 'src/domain/aggregate-event';
import {UserEmail} from 'src/domain/application-management/user';

export class UserSubscribed implements AggregateEvent {
  constructor(
    readonly aggregateId: string,
    readonly date: Date,
    readonly userEmail: UserEmail
  ) {}
}
