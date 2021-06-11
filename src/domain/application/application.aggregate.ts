import {Brand} from '../branded-types';
import {DGFIPDataProvider} from '../dgfip/data-provider';
import {DGFIPInput, DGFIPOutput} from '../dgfip/dto';
import {DGFIPScopesFilter} from '../dgfip/scopes.filter';
import {ApplicationNotSubscribedError} from './errors/application-not-subscribed.error';

export type ApplicationId = Brand<string, 'ApplicationId'>;
export type Subscription = 'DGFIP' | 'CNAF';
export type Scope =
  | 'dgfip_avis_imposition'
  | 'dgfip_adresse'
  | 'cnaf_adresse'
  | 'cnaf_allocataires'
  | 'cnaf_enfants'
  | 'cnaf_quotient_familial';

export class Application {
  constructor(
    public readonly id: ApplicationId,
    public readonly name: string,
    public readonly subscriptions: Subscription[],
    private readonly scopes: Scope[]
  ) {}

  async consumeDGFIP(
    input: DGFIPInput,
    provider: DGFIPDataProvider,
    scopesFilter: DGFIPScopesFilter
  ): Promise<Partial<DGFIPOutput>> {
    if (!this.subscriptions.includes('DGFIP')) {
      throw new ApplicationNotSubscribedError(this, 'DGFIP');
    }
    const unfilteredData = await provider.fetch(input);
    return scopesFilter.filter(unfilteredData, this.scopes);
  }
}
