import {TokenValueFactory} from 'src/domain/application-management/token-value.factory';
import {ApplicationId} from 'src/domain/application-id';
import {AnyScope} from 'src/domain/scopes';
import {AggregateRoot} from 'src/domain/aggregate-root';
import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {UserEmail} from 'src/domain/application-management/user';
import {UserSubscribed} from 'src/domain/application-management/events/user-subscribed.event';
import {UuidFactory} from 'src/domain/uuid.factory';
import {TokenValue} from 'src/domain/token-value';
import {Subscription} from 'src/domain/subscription';
import {ApplicationImported} from 'src/domain/application-management/events/application-imported.event';
import {logFor} from 'src/domain/logger';

export type Token = {
  value: TokenValue;
  createdOn: Date;
};

export class Application extends AggregateRoot {
  public id!: ApplicationId;
  public name!: string;
  public createdOn!: Date;
  public dataPassId!: string;
  public tokens!: Token[];
  public subscriptions!: Subscription[];
  public userEmails!: UserEmail[];
  private scopes!: AnyScope[];
  private readonly logger = logFor(Application.name);

  private constructor() {
    super();
  }

  static create(
    name: string,
    dataPassId: string,
    subscriptions: Subscription[],
    scopes: AnyScope[],
    userEmails: UserEmail[],
    uuidFactory: UuidFactory,
    tokenValueFactory: TokenValueFactory
  ): Application {
    const self = new this();

    const applicationCreatedEvent = new ApplicationCreated(
      uuidFactory.generateUuid() as ApplicationId,
      new Date(),
      name,
      dataPassId,
      scopes,
      subscriptions,
      userEmails,
      tokenValueFactory.generateTokenValue()
    );
    self.raiseAndApply(applicationCreatedEvent);

    return self;
  }

  static import(
    id: ApplicationId,
    name: string,
    dataPassId: string,
    subscriptions: Subscription[],
    scopes: AnyScope[],
    userEmails: UserEmail[],
    tokenValue: TokenValue
  ): Application {
    const self = new this();

    const applicationImportedEvent = new ApplicationImported(
      id,
      new Date(),
      name,
      dataPassId,
      scopes,
      subscriptions,
      userEmails,
      tokenValue
    );
    self.raiseAndApply(applicationImportedEvent);

    return self;
  }

  subscribeUser(userEmail: UserEmail) {
    const event = new UserSubscribed(this.id, new Date(), userEmail);

    this.raiseAndApply(event);
  }

  private applyApplicationCreated(event: ApplicationCreated) {
    this.logger.log('debug', `Creating application "${event.name}"`, {event});

    this.id = event.aggregateId as ApplicationId;
    this.name = event.name;
    this.dataPassId = event.dataPassId;
    this.createdOn = event.date;
    this.scopes = event.scopes;
    this.subscriptions = event.subscriptions;
    this.userEmails = event.userEmails;
    this.tokens = [{createdOn: event.date, value: event.tokenValue}];
  }

  private applyApplicationImported(event: ApplicationImported) {
    this.logger.log('debug', `Importing application "${event.name}"`, {event});

    this.id = event.aggregateId as ApplicationId;
    this.name = event.name;
    this.dataPassId = event.dataPassId;
    this.createdOn = event.date;
    this.scopes = event.scopes;
    this.subscriptions = event.subscriptions;
    this.userEmails = event.userEmails;
    this.tokens = [{createdOn: event.date, value: event.tokenValue}];
  }

  private applyUserSubscribed(event: UserSubscribed) {
    this.logger.log('debug', `Adding user to application "${this.name}"`, {
      event,
    });

    this.userEmails.push(event.userEmail);
  }
}
