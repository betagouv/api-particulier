import {ApplicationId} from 'src/domain/application-id';
import {Subscription} from 'src/domain/gateway/application.aggregate';
import {AnyScope} from 'src/domain/gateway/scopes';
import {TokenValue} from 'src/domain/token-value';

export class Token {
  constructor(
    readonly applicationId: ApplicationId,
    readonly value: TokenValue,
    readonly scopes: AnyScope[],
    readonly subscriptions: Subscription[]
  ) {}
}
