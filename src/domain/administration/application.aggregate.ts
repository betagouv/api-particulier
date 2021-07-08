import {Token} from 'src/domain/administration/token';
import {TokenFactory} from 'src/domain/administration/token.factory';
import {ApplicationId} from 'src/domain/application-id';

export class Application {
  private constructor(
    public readonly id: ApplicationId,
    public readonly name: string,
    public readonly createdOn: Date,
    public readonly dataPassId: string,
    public readonly tokens: Token[]
  ) {}

  static create(name: string, dataPassId: string): Application {
    return new Application(
      'croute' as ApplicationId,
      name,
      new Date(),
      dataPassId,
      []
    );
  }

  generateNewToken(tokenFactory: TokenFactory) {
    const [token, apiKey] = tokenFactory.generateToken();
    this.tokens.push(token);

    return apiKey;
  }
}
