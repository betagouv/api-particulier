import {DGFIPDataProvider} from '../administration/dgfip/data-provider';
import {DGFIPInput, DGFIPOutput} from '../administration/dgfip/dto';
import {ApplicationNotSubscribedError} from './errors/application-not-subscribed.error';
import {CNAFInput, CNAFOutput} from '../administration/cnaf/dto';
import {CNAFDataProvider} from '../administration/cnaf/data-provider';
import {PropertyBasedScopesFilter} from './property-based.scopes-filter';
import {AnyScope, unifiedScopesConfiguration} from './scopes';
import {ApplicationId} from 'src/domain/application-id';

export type Subscription = 'DGFIP' | 'CNAF';

const propertyBasedScopesFilter = new PropertyBasedScopesFilter(
  unifiedScopesConfiguration
);

export class Application {
  constructor(
    public readonly id: ApplicationId,
    public readonly subscriptions: Subscription[],
    private readonly scopes: AnyScope[]
  ) {}

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
}
