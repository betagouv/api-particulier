import {ApplicationId} from 'src/domain/application-id';
import {TokenValueFactory} from 'src/domain/application-management/token-value.factory';
import {UserEmail} from 'src/domain/application-management/user';
import {AnyScope} from 'src/domain/scopes';
import {Subscription} from 'src/domain/subscription';
import {TokenValue} from 'src/domain/token-value';
import {UuidFactory} from 'src/domain/uuid.factory';

export class Application {
  constructor(
    public readonly id: ApplicationId,
    public readonly name: string,
    public readonly createdOn: Date,
    public readonly dataPassId: string,
    public readonly token: {
      value: TokenValue;
      subscriptions: Subscription[];
      scopes: AnyScope[];
    },
    public readonly userEmails: UserEmail[]
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
      {
        value: tokenValueFactory.generateTokenValue(),
        subscriptions,
        scopes,
      },
      userEmails
    );
  }

  subscribeUser(userEmail: UserEmail) {
    this.userEmails.push(userEmail);
  }
}
