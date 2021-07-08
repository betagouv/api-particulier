import {ApplicationId} from 'src/domain/gateway/application-id';
import {Subscription} from 'src/domain/gateway/application.aggregate';
import {ApplicationEvent} from 'src/domain/gateway/application.event';
import {AnyScope} from 'src/domain/gateway/scopes';

export class ApplicationCreated extends ApplicationEvent {
  constructor(
    applicationId: ApplicationId,
    readonly name: string,
    readonly dataPassId: string,
    readonly scopes: AnyScope[],
    readonly subscriptions: Subscription[]
  ) {
    super(applicationId, new Date());
  }
}
