import {CnafDataProvider} from 'src/domain/data-fetching/data-providers/cnaf/data-provider';
import {CnafInput} from 'src/domain/data-fetching/data-providers/cnaf/dto';
import {DgfipDataProvider} from 'src/domain/data-fetching/data-providers/dgfip/data-provider';
import {DgfipInput} from 'src/domain/data-fetching/data-providers/dgfip/dto';
import {ApplicationNotSubscribedError} from 'src/domain/data-fetching/errors/application-not-subscribed.error';
import {Token} from 'src/domain/data-fetching/projections/token';
import {unifiedScopesConfiguration} from 'src/domain/scopes';
import {PropertyBasedScopesFilter} from 'src/domain/data-fetching/scopes-filters/property-based.scopes-filter';
import {DataProvider} from 'src/domain/data-fetching/data-providers/data-provider';
import {Subscription} from 'src/domain/subscription';

const propertyBasedScopesFilter = new PropertyBasedScopesFilter(
  unifiedScopesConfiguration
);

export class DataProviderClient {
  constructor(
    private readonly cnafDataProvider: CnafDataProvider,
    private readonly dgfipDataProvider: DgfipDataProvider
  ) {}

  consumeDgfip(input: DgfipInput, token: Token, route: string) {
    return this.callDataProvider(
      input,
      token,
      route,
      this.dgfipDataProvider,
      'DGFIP'
    );
  }

  consumeCnaf(input: CnafInput, token: Token, route: string) {
    return this.callDataProvider(
      input,
      token,
      route,
      this.cnafDataProvider,
      'CNAF'
    );
  }

  private async callDataProvider<I, O>(
    input: I,
    token: Token,
    route: string,
    dataProvider: DataProvider<I, O>,
    neededSubscription: Subscription
  ) {
    if (!token.subscriptions.includes(neededSubscription)) {
      throw new ApplicationNotSubscribedError(
        token.applicationId,
        neededSubscription
      );
    }
    const unfilteredData = await dataProvider.fetch(input);

    return propertyBasedScopesFilter.filter(token.scopes, unfilteredData);
  }
}
