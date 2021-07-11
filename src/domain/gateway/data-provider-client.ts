import {CnafDataProvider} from 'src/domain/gateway/data-providers/cnaf/data-provider';
import {
  CnafInput,
  CnafOutput,
} from 'src/domain/gateway/data-providers/cnaf/dto';
import {DGFIPDataProvider} from 'src/domain/gateway/data-providers/dgfip/data-provider';
import {
  DGFIPInput,
  DGFIPOutput,
} from 'src/domain/gateway/data-providers/dgfip/dto';
import {ApplicationNotSubscribedError} from 'src/domain/gateway/errors/application-not-subscribed.error';
import {Token} from 'src/domain/gateway/projections/token';
import {unifiedScopesConfiguration} from 'src/domain/gateway/scopes';
import {PropertyBasedScopesFilter} from 'src/domain/gateway/scopes-filters/property-based.scopes-filter';

const propertyBasedScopesFilter = new PropertyBasedScopesFilter(
  unifiedScopesConfiguration
);

export class DataProviderClient {
  constructor(
    private readonly cnafDataProvider: CnafDataProvider,
    private readonly dgfipDataProvider: DGFIPDataProvider
  ) {}

  async consumeDGFIP(
    input: DGFIPInput,
    token: Token
  ): Promise<Partial<DGFIPOutput>> {
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
