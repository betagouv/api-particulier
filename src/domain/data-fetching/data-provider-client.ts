import {CnafDataProvider} from 'src/domain/data-fetching/data-providers/cnaf/data-provider';
import {CnafInput} from 'src/domain/data-fetching/data-providers/cnaf/dto';
import {DgfipDataProvider} from 'src/domain/data-fetching/data-providers/dgfip/data-provider';
import {DgfipInput} from 'src/domain/data-fetching/data-providers/dgfip/dto';
import {ApplicationNotSubscribedError} from 'src/domain/data-fetching/errors/application-not-subscribed.error';
import {Token} from 'src/domain/data-fetching/projections/token';
import {unifiedScopesConfiguration} from 'src/domain/scopes';
import {PropertyBasedScopesFilter} from 'src/domain/data-fetching/scopes-filters/property-based.scopes-filter';
import {EventBus} from 'src/domain/event-bus';
import {Timer} from 'src/domain/data-fetching/timer';
import {TokenConsumed} from 'src/domain/data-fetching/events/token-consumed.event';
import {DataProvider} from 'src/domain/data-fetching/data-providers/data-provider';
import {Subscription} from 'src/domain/subscription';
import {NetworkError} from 'src/domain/data-fetching/errors/network.error';
import {ApplicationId} from 'src/domain/application-id';

const propertyBasedScopesFilter = new PropertyBasedScopesFilter(
  unifiedScopesConfiguration
);

export class DataProviderClient {
  constructor(
    private readonly cnafDataProvider: CnafDataProvider,
    private readonly dgfipDataProvider: DgfipDataProvider,
    private readonly eventBus: EventBus
  ) {}

  consumeDgfip(input: DgfipInput, token: Token) {
    return this.callDataProvider(input, token, this.dgfipDataProvider, 'DGFIP');
  }

  consumeCnaf(input: CnafInput, token: Token) {
    return this.callDataProvider(input, token, this.cnafDataProvider, 'CNAF');
  }

  private async callDataProvider<I, O>(
    input: I,
    token: Token,
    dataProvider: DataProvider<I, O>,
    neededSubscription: Subscription
  ) {
    if (!token.subscriptions.includes(neededSubscription)) {
      throw new ApplicationNotSubscribedError(
        token.applicationId,
        neededSubscription
      );
    }
    const timer = new Timer();
    timer.start();
    let unfilteredData: O;

    try {
      unfilteredData = await dataProvider.fetch(input);
    } catch (error) {
      const timeSpent = timer.stop();
      const statusCode =
        error instanceof NetworkError ? error.status || 502 : 500;
      this.publishConsumptionEvent(
        token.applicationId,
        neededSubscription,
        '/route',
        statusCode,
        timeSpent
      );
      throw error;
    }

    const timeSpent = timer.stop();
    this.publishConsumptionEvent(
      token.applicationId,
      neededSubscription,
      '/route',
      200,
      timeSpent
    );

    return propertyBasedScopesFilter.filter(token.scopes, unfilteredData);
  }

  private publishConsumptionEvent(
    applicationId: ApplicationId,
    subscription: Subscription,
    route: string,
    statusCode: number,
    timeSpent: number
  ) {
    const event = new TokenConsumed(
      applicationId,
      new Date(),
      subscription,
      route,
      statusCode,
      timeSpent
    );
    this.eventBus.publish(event);
  }
}
