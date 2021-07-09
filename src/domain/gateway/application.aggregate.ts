import {ApplicationNotSubscribedError} from 'src/domain/gateway/errors/application-not-subscribed.error';
import {Token} from 'src/domain/gateway/token';
import {TokenFactory} from 'src/domain/gateway/token.factory';
import {ApplicationId} from 'src/domain/gateway/application-id';
import {CNAFDataProvider} from 'src/domain/gateway/cnaf/data-provider';
import {CNAFInput, CNAFOutput} from 'src/domain/gateway/cnaf/dto';
import {DGFIPDataProvider} from 'src/domain/gateway/dgfip/data-provider';
import {DGFIPInput, DGFIPOutput} from 'src/domain/gateway/dgfip/dto';
import {PropertyBasedScopesFilter} from 'src/domain/gateway/property-based.scopes-filter';
import {AnyScope, unifiedScopesConfiguration} from 'src/domain/gateway/scopes';
import {AggregateRoot} from 'src/domain/aggregate-root';
import {ApplicationEvent} from 'src/domain/gateway/application.event';
import {ApplicationCreated} from 'src/domain/gateway/events/application-created.event';
import {UserEmail} from 'src/domain/gateway/user';
import {UserSubscribed} from 'src/domain/gateway/events/user-subscribed.event';

export type Subscription = 'DGFIP' | 'CNAF';

const propertyBasedScopesFilter = new PropertyBasedScopesFilter(
  unifiedScopesConfiguration
);

export class Application extends AggregateRoot<ApplicationEvent> {
  public id!: ApplicationId;
  public name!: string;
  public createdOn!: Date;
  public dataPassId!: string;
  public tokens!: Token[];
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
    userEmails: UserEmail[]
  ): Application {
    const self = new this();

    const applicationCreatedEvent = new ApplicationCreated(
      'croute' as ApplicationId,
      new Date(),
      name,
      dataPassId,
      scopes,
      subscriptions,
      userEmails
    );
    self.raiseAndApply(applicationCreatedEvent);

    return self;
  }

  generateNewToken(tokenFactory: TokenFactory) {
    const token = tokenFactory.generateToken();
    this.tokens.push(token);
  }

  subscribeUser(userEmail: UserEmail) {
    const event = new UserSubscribed(this.id, new Date(), userEmail);

    this.raiseAndApply(event);
  }

  async consumeDGFIP(
    input: DGFIPInput,
    provider: DGFIPDataProvider
  ): Promise<Partial<DGFIPOutput>> {
    if (!this.subscriptions.includes('DGFIP')) {
      throw new ApplicationNotSubscribedError(this, 'DGFIP');
    }
    const unfilteredData = await provider.fetch(input);
    return propertyBasedScopesFilter.filter(this.scopes, unfilteredData);
  }

  async consumeCNAF(
    input: CNAFInput,
    provider: CNAFDataProvider
  ): Promise<Partial<CNAFOutput>> {
    if (!this.subscriptions.includes('CNAF')) {
      throw new ApplicationNotSubscribedError(this, 'CNAF');
    }
    const unfilteredData = await provider.fetch(input);
    return propertyBasedScopesFilter.filter(this.scopes, unfilteredData);
  }

  private applyApplicationCreated(event: ApplicationCreated) {
    this.id = event.aggregateId as ApplicationId;
    this.name = event.name;
    this.dataPassId = event.dataPassId;
    this.createdOn = event.date;
    this.scopes = event.scopes;
    this.subscriptions = event.subscriptions;
    this.userEmails = event.userEmails;
    this.tokens = [];
  }

  private applyUserSubscribed(event: UserSubscribed) {
    this.userEmails.push(event.userEmail);
  }
}
