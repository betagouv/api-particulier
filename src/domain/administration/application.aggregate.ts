import {ApplicationNotSubscribedError} from 'src/domain/administration/errors/application-not-subscribed.error';
import {Token} from 'src/domain/administration/token';
import {TokenFactory} from 'src/domain/administration/token.factory';
import {ApplicationId} from 'src/domain/administration/application-id';
import {CNAFDataProvider} from 'src/domain/administration/cnaf/data-provider';
import {CNAFInput, CNAFOutput} from 'src/domain/administration/cnaf/dto';
import {DGFIPDataProvider} from 'src/domain/administration/dgfip/data-provider';
import {DGFIPInput, DGFIPOutput} from 'src/domain/administration/dgfip/dto';
import {PropertyBasedScopesFilter} from 'src/domain/administration/property-based.scopes-filter';
import {
  AnyScope,
  unifiedScopesConfiguration,
} from 'src/domain/administration/scopes';

export type Subscription = 'DGFIP' | 'CNAF';

const propertyBasedScopesFilter = new PropertyBasedScopesFilter(
  unifiedScopesConfiguration
);

export class Application {
  private constructor(
    public readonly id: ApplicationId,
    public readonly name: string,
    public readonly createdOn: Date,
    public readonly dataPassId: string,
    public readonly tokens: Token[],
    public readonly subscriptions: Subscription[],
    private readonly scopes: AnyScope[]
  ) {}

  static create(
    name: string,
    dataPassId: string,
    subscriptions: Subscription[],
    scopes: AnyScope[]
  ): Application {
    return new Application(
      'croute' as ApplicationId,
      name,
      new Date(),
      dataPassId,
      [],
      subscriptions,
      scopes
    );
  }

  generateNewToken(tokenFactory: TokenFactory) {
    const [token, apiKey] = tokenFactory.generateToken();
    this.tokens.push(token);

    return apiKey;
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
}
