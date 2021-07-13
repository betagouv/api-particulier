import {UserEmail} from 'src/domain/application-management/user';
import {Event} from 'src/domain/event';

export class UserSubscribed implements Event {
  constructor(
    readonly aggregateId: string,
    readonly date: Date,
    readonly userEmail: UserEmail
  ) {}
}
