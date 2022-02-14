import {setUser} from '@sentry/node';
import {DataProviderClient} from 'src/domain/data-fetching/data-provider-client';
import {CnafInput} from 'src/domain/data-fetching/data-providers/cnaf/dto';
import {CnousInput} from 'src/domain/data-fetching/data-providers/cnous/dto';
import {DgfipInput} from 'src/domain/data-fetching/data-providers/dgfip/dto';
import {MesriInput} from 'src/domain/data-fetching/data-providers/mesri/dto';
import {PoleEmploiInput} from 'src/domain/data-fetching/data-providers/pole-emploi/dto';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenCache} from 'src/domain/data-fetching/token.cache';
import {TokenValue} from 'src/domain/token-value';

export class FetchDataUsecase {
  constructor(
    private readonly tokenCache: TokenCache,
    private readonly dataProviderClient: DataProviderClient
  ) {}

  async fetchDgfipData(
    apiKey: TokenValue,
    input: DgfipInput,
    setCurrentToken: (token: Token) => void
  ) {
    return this.callDataProvider(
      apiKey,
      input,
      setCurrentToken,
      'consumeDgfip'
    );
  }

  async fetchCnafData(
    apiKey: TokenValue,
    input: CnafInput,
    setCurrentToken: (token: Token) => void
  ) {
    return this.callDataProvider(apiKey, input, setCurrentToken, 'consumeCnaf');
  }

  async fetchPoleEmploiData(
    apiKey: TokenValue,
    input: PoleEmploiInput,
    setCurrentToken: (token: Token) => void
  ) {
    return this.callDataProvider(
      apiKey,
      input,
      setCurrentToken,
      'consumePoleEmploi'
    );
  }

  async fetchMesriData(
    apiKey: TokenValue,
    input: MesriInput,
    setCurrentToken: (token: Token) => void
  ) {
    return this.callDataProvider(
      apiKey,
      input,
      setCurrentToken,
      'consumeMesri'
    );
  }

  async fetchCnousData(
    apiKey: TokenValue,
    input: CnousInput,
    setCurrentToken: (token: Token) => void
  ) {
    return this.callDataProvider(
      apiKey,
      input,
      setCurrentToken,
      'consumeCnous'
    );
  }

  private async callDataProvider<I, O>(
    apiKey: TokenValue,
    input: I,
    setCurrentToken: (token: Token) => void,
    providerFunctionName: keyof DataProviderClient
  ): Promise<Partial<O>> {
    const token = await this.tokenCache.findByTokenValue(apiKey);
    setUser({id: token.application.id});
    setCurrentToken(token);
    return this.dataProviderClient[providerFunctionName](
      input as unknown as DgfipInput &
        CnafInput &
        PoleEmploiInput &
        MesriInput &
        CnousInput,
      token
    ) as unknown as Partial<O>;
  }
}
