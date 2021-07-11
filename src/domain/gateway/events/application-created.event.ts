import {ApplicationId} from 'src/domain/gateway/application-id';
import {Subscription} from 'src/domain/gateway/application.aggregate';
import {ApplicationEvent} from 'src/domain/gateway/events/application.event';
import {AnyScope} from 'src/domain/gateway/scopes';
import {Token} from 'src/domain/gateway/token';
import {UserEmail} from 'src/domain/gateway/user';

export class ApplicationCreated extends ApplicationEvent {
  constructor(
    applicationId: ApplicationId,
    date: Date,
    readonly name: string,
    readonly dataPassId: string,
    readonly scopes: AnyScope[],
    readonly subscriptions: Subscription[],
    readonly userEmails: UserEmail[],
    readonly token: Token
  ) {
    super(applicationId, date);
  }
}
