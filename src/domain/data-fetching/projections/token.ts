import {ApplicationId} from 'src/domain/application-id';
import {Scope} from 'src/domain/scopes';
import {Subscription} from 'src/domain/subscription';
import {TokenValue} from 'src/domain/token-value';

export class UnsavedToken {
  constructor(
    readonly application: {
      id: ApplicationId;
      name: string;
    },
    readonly value: TokenValue,
    readonly scopes: Scope[],
    readonly subscriptions: Subscription[]
  ) {}
}

export class Token extends UnsavedToken {
  constructor(
    readonly id: string,
    ...rest: [
      {
        id: ApplicationId;
        name: string;
      },
      TokenValue,
      Scope[],
      Subscription[]
    ]
  ) {
    super(...rest);
  }
}
