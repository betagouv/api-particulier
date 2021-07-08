import {ApplicationId} from 'src/domain/gateway/application-id';
import {Subscription} from 'src/domain/gateway/application.aggregate';
import {ApplicationEvent} from 'src/domain/gateway/application.event';
import {AnyScope} from 'src/domain/gateway/scopes';
import {UserEmail} from 'src/domain/gateway/user';

export class ApplicationCreated extends ApplicationEvent {
  constructor(
    applicationId: ApplicationId,
    readonly name: string,
    readonly dataPassId: string,
    readonly scopes: AnyScope[],
    readonly subscriptions: Subscription[],
    readonly userEmails: UserEmail[]
  ) {
    super(applicationId, new Date());
  }
}
