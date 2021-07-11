import {ApplicationId} from 'src/domain/application-id';
import {ApplicationEvent} from 'src/domain/gateway/events/application.event';
import {AnyScope} from 'src/domain/scopes';
import {TokenValue} from 'src/domain/token-value';
import {UserEmail} from 'src/domain/gateway/user';
import {Subscription} from 'src/domain/subscription';

export class ApplicationCreated extends ApplicationEvent {
  constructor(
    applicationId: ApplicationId,
    date: Date,
    readonly name: string,
    readonly dataPassId: string,
    readonly scopes: AnyScope[],
    readonly subscriptions: Subscription[],
    readonly userEmails: UserEmail[],
    readonly tokenValue: TokenValue
  ) {
    super(applicationId, date);
  }
}
