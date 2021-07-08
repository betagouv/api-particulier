import {ApplicationId} from 'src/domain/gateway/application-id';
import {ApplicationEvent} from 'src/domain/gateway/application.event';
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
