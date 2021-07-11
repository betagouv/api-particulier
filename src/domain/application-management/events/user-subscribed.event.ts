import {ApplicationId} from 'src/domain/application-id';
import {ApplicationEvent} from 'src/domain/application-management/events/application.event';
import {UserEmail} from 'src/domain/application-management/user';

export class UserSubscribed extends ApplicationEvent {
  constructor(
    applicationId: ApplicationId,
    date: Date,
    readonly userEmail: UserEmail
  ) {
    super(applicationId, date);
  }
}
