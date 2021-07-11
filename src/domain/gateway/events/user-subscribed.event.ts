import {ApplicationId} from 'src/domain/application-id';
import {ApplicationEvent} from 'src/domain/gateway/events/application.event';
import {UserEmail} from 'src/domain/gateway/user';

export class UserSubscribed extends ApplicationEvent {
  constructor(
    applicationId: ApplicationId,
    date: Date,
    readonly userEmail: UserEmail
  ) {
    super(applicationId, date);
  }
}
