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
import {PoleEmploiInput} from 'src/domain/data-fetching/data-providers/pole-emploi/dto';
import {PoleEmploiDataProvider} from 'src/domain/data-fetching/data-providers/pole-emploi/data-provider';
import {MesriInput} from 'src/domain/data-fetching/data-providers/mesri/dto';
import {MesriDataProvider} from 'src/domain/data-fetching/data-providers/mesri/data-provider';
import {MesriScopesFilter} from 'src/domain/data-fetching/scopes-filters/mesri.scopes-filter';

const propertyBasedScopesFilter = new PropertyBasedScopesFilter(
  unifiedScopesConfiguration
);
const mesriScopesFilter = new MesriScopesFilter();

export class DataProviderClient {
  constructor(
    private readonly cnafDataProvider: CnafDataProvider,
    private readonly dgfipDataProvider: DgfipDataProvider,
    private readonly poleEmploiDataProvider: PoleEmploiDataProvider,
    private readonly mesriDataProvider: MesriDataProvider
  ) {}

  async consumeDgfip(input: DgfipInput, token: Token, route: string) {
    return await this.callDataProvider(
      input,
      token,
      route,
      this.dgfipDataProvider,
      'DGFIP'
    );
  }

  async consumeCnaf(input: CnafInput, token: Token, route: string) {
    return await this.callDataProvider(
      input,
      token,
      route,
      this.cnafDataProvider,
      'CNAF'
    );
  }

  async consumePoleEmploi(input: PoleEmploiInput, token: Token, route: string) {
    return await this.callDataProvider(
      input,
      token,
      route,
      this.poleEmploiDataProvider,
      'POLE_EMPLOI'
    );
  }

  async consumeMesri(input: MesriInput, token: Token, route: string) {
    const propertyFilteredResult = await this.callDataProvider(
      input,
      token,
      route,
      this.mesriDataProvider,
      'MESRI',
      {
        caller: token.applicationId,
      }
    );

    return {
      ...propertyFilteredResult,
      inscriptions: mesriScopesFilter.filterInsriptions(
        token.scopes,
        propertyFilteredResult.inscriptions ?? []
      ),
    };
  }

  private async callDataProvider<I, O, M>(
    input: I,
    token: Token,
    route: string,
    dataProvider: DataProvider<I, O, M>,
    neededSubscription: Subscription,
    metadata?: M
  ): Promise<Partial<O>> {
    if (!token.subscriptions.includes(neededSubscription)) {
      throw new ApplicationNotSubscribedError(
        token.applicationId,
        neededSubscription
      );
    }
    const unfilteredData = await dataProvider.fetch(input, metadata);

    return propertyBasedScopesFilter.filter(token.scopes, unfilteredData);
  }
}
