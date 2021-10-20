import {ApplicationId} from 'src/domain/application-id';
import {AnyScope} from 'src/domain/scopes';
import {Subscription} from 'src/domain/subscription';
import {TokenValue} from 'src/domain/token-value';

export class Token {
  constructor(
    readonly application: {
      id: ApplicationId;
      name: string;
    },
    readonly value: TokenValue,
    readonly scopes: AnyScope[],
    readonly subscriptions: Subscription[],
    readonly id?: string
  ) {}
}
