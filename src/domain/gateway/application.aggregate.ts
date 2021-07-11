import {TokenValueFactory} from 'src/domain/gateway/token-value.factory';
import {ApplicationId} from 'src/domain/gateway/application-id';
import {AnyScope} from 'src/domain/gateway/scopes';
import {AggregateRoot} from 'src/domain/aggregate-root';
import {ApplicationEvent} from 'src/domain/gateway/events/application.event';
import {ApplicationCreated} from 'src/domain/gateway/events/application-created.event';
import {UserEmail} from 'src/domain/gateway/user';
import {UserSubscribed} from 'src/domain/gateway/events/user-subscribed.event';
import {UuidFactory} from 'src/domain/uuid.factory';
import {TokenValue} from 'src/domain/gateway/token-value';

export type Subscription = 'DGFIP' | 'CNAF';

export class Application extends AggregateRoot<ApplicationEvent> {
  public id!: ApplicationId;
  public name!: string;
  public createdOn!: Date;
  public dataPassId!: string;
  public tokenValue!: TokenValue;
  public subscriptions!: Subscription[];
  public userEmails!: UserEmail[];
  private scopes!: AnyScope[];

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

  subscribeUser(userEmail: UserEmail) {
    const event = new UserSubscribed(this.id, new Date(), userEmail);

    this.raiseAndApply(event);
  }

  private applyApplicationCreated(event: ApplicationCreated) {
    this.id = event.aggregateId as ApplicationId;
    this.name = event.name;
    this.dataPassId = event.dataPassId;
    this.createdOn = event.date;
    this.scopes = event.scopes;
    this.subscriptions = event.subscriptions;
    this.userEmails = event.userEmails;
    this.tokenValue = event.tokenValue;
  }

  private applyUserSubscribed(event: UserSubscribed) {
    this.userEmails.push(event.userEmail);
  }
}
