import {CnafDataProvider} from 'src/domain/data-fetching/data-providers/cnaf/data-provider';
import {
  CnafInput,
  CnafOutput,
} from 'src/domain/data-fetching/data-providers/cnaf/dto';
import {DgfipDataProvider} from 'src/domain/data-fetching/data-providers/dgfip/data-provider';
import {
  DgfipInput,
  DgfipOutput,
} from 'src/domain/data-fetching/data-providers/dgfip/dto';
import {ApplicationNotSubscribedError} from 'src/domain/data-fetching/errors/application-not-subscribed.error';
import {Token} from 'src/domain/data-fetching/projections/token';
import {unifiedScopesConfiguration} from 'src/domain/scopes';
import {PropertyBasedScopesFilter} from 'src/domain/data-fetching/scopes-filters/property-based.scopes-filter';

const propertyBasedScopesFilter = new PropertyBasedScopesFilter(
  unifiedScopesConfiguration
);

export class DataProviderClient {
  constructor(
    private readonly cnafDataProvider: CnafDataProvider,
    private readonly dgfipDataProvider: DgfipDataProvider
  ) {}

  async consumeDgfip(
    input: DgfipInput,
    token: Token
  ): Promise<Partial<DgfipOutput>> {
    if (!token.subscriptions.includes('DGFIP')) {
      throw new ApplicationNotSubscribedError(token.applicationId, 'CNAF');
    }
    const unfilteredData = await this.dgfipDataProvider.fetch(input);
    return propertyBasedScopesFilter.filter(token.scopes, unfilteredData);
  }

  async consumeCnaf(
    input: CnafInput,
    token: Token
  ): Promise<Partial<CnafOutput>> {
    if (!token.subscriptions.includes('CNAF')) {
      throw new ApplicationNotSubscribedError(token.applicationId, 'CNAF');
    }
    const unfilteredData = await this.cnafDataProvider.fetch(input);
    return propertyBasedScopesFilter.filter(token.scopes, unfilteredData);
  }
}
