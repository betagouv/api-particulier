import {Token} from 'src/domain/administration/token';
import {TokenFactory} from 'src/domain/administration/token.factory';
import {ApplicationId} from 'src/domain/application-id';
import {AnyScope} from 'src/domain/data-fetching/scopes';

export type Subscription = 'DGFIP' | 'CNAF';

export class Application {
  private constructor(
    public readonly id: ApplicationId,
    public readonly name: string,
    public readonly createdOn: Date,
    public readonly dataPassId: string,
    public readonly tokens: Token[],
    public readonly subscriptions: Subscription[],
    private readonly scopes: AnyScope[]
  ) {}

  static create(
    name: string,
    dataPassId: string,
    subscriptions: Subscription[],
    scopes: AnyScope[]
  ): Application {
    return new Application(
      'croute' as ApplicationId,
      name,
      new Date(),
      dataPassId,
      [],
      subscriptions,
      scopes
    );
  }

  generateNewToken(tokenFactory: TokenFactory) {
    const [token, apiKey] = tokenFactory.generateToken();
    this.tokens.push(token);

    return apiKey;
  }
}
