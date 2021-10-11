import {ApplicationId} from 'src/domain/application-id';
import {TokenValueFactory} from 'src/domain/application-management/token-value.factory';
import {UserEmail} from 'src/domain/application-management/user';
import {logFor} from 'src/domain/logger';
import {AnyScope} from 'src/domain/scopes';
import {Subscription} from 'src/domain/subscription';
import {TokenValue} from 'src/domain/token-value';
import {UuidFactory} from 'src/domain/uuid.factory';

export class Application {
  private readonly logger = logFor(Application.name);

  constructor(
    public readonly id: ApplicationId,
    public readonly name: string,
    public readonly createdOn: Date,
    public readonly dataPassId: string,
    public readonly tokens: TokenValue[],
    public readonly subscriptions: Subscription[],
    public readonly userEmails: UserEmail[],
    public readonly scopes: AnyScope[]
  ) {}

  static create(
    name: string,
    dataPassId: string,
    subscriptions: Subscription[],
    scopes: AnyScope[],
    userEmails: UserEmail[],
    uuidFactory: UuidFactory,
    tokenValueFactory: TokenValueFactory
  ): Application {
    return new this(
      uuidFactory.generateUuid() as ApplicationId,
      name,
      new Date(),
      dataPassId,
      [tokenValueFactory.generateTokenValue()],
      subscriptions,
      userEmails,
      scopes
    );
  }

  static import(
    id: ApplicationId,
    name: string,
    dataPassId: string,
    subscriptions: Subscription[],
    scopes: AnyScope[],
    userEmails: UserEmail[],
    tokenValues: TokenValue[]
  ): Application {
    return new this(
      id,
      name,
      new Date(),
      dataPassId,
      tokenValues,
      subscriptions,
      userEmails,
      scopes
    );
  }

  subscribeUser(userEmail: UserEmail) {
    this.userEmails.push(userEmail);
  }
}
