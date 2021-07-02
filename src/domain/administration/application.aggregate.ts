import {Token} from 'src/domain/administration/token';
import {TokenFactory} from 'src/domain/administration/token.factory';
import {ApplicationId} from 'src/domain/application-id';

export class Application {
  constructor(
    public readonly id: ApplicationId,
    public readonly name: string,
    public readonly createdOn: Date,
    public readonly dataPassId: string,
    public readonly tokens: Token[]
  ) {}

  generateNewToken(tokenFactory: TokenFactory) {
    const [token, apiKey] = tokenFactory.generateToken();
    this.tokens.push(token);

    return apiKey;
  }
}
