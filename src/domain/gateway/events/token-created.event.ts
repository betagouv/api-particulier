import {ApplicationId} from 'src/domain/gateway/application-id';
import {ApplicationEvent} from 'src/domain/gateway/events/application.event';
import {Token} from 'src/domain/gateway/token';

export class TokenCreated extends ApplicationEvent {
  constructor(applicationId: ApplicationId, date: Date, readonly token: Token) {
    super(applicationId, date);
  }
}
