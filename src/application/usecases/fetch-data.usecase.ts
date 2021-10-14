import {setUser} from '@sentry/node';
import {DataProviderClient} from 'src/domain/data-fetching/data-provider-client';
import {CnafInput} from 'src/domain/data-fetching/data-providers/cnaf/dto';
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
    tokenValue: TokenValue,
    input: DgfipInput,
    route: string,
    setCurrentToken: (token: Token) => void
  ) {
    const token = await this.tokenCache.findByTokenValue(tokenValue);
    setUser({id: token.application.id});
    setCurrentToken(token);
    return this.dataProviderClient.consumeDgfip(input, token, route);
  }

  async fetchCnafData(
    tokenValue: TokenValue,
    input: CnafInput,
    route: string,
    setCurrentToken: (token: Token) => void
  ) {
    const token = await this.tokenCache.findByTokenValue(tokenValue);
    setCurrentToken(token);
    return this.dataProviderClient.consumeCnaf(input, token, route);
  }

  async fetchPoleEmploiData(
    tokenValue: TokenValue,
    input: PoleEmploiInput,
    route: string,
    setCurrentToken: (token: Token) => void
  ) {
    const token = await this.tokenCache.findByTokenValue(tokenValue);
    setCurrentToken(token);
    return this.dataProviderClient.consumePoleEmploi(input, token, route);
  }

  async fetchMesriData(
    tokenValue: TokenValue,
    input: MesriInput,
    route: string,
    setCurrentToken: (token: Token) => void
  ) {
    const token = await this.tokenCache.findByTokenValue(tokenValue);
    setCurrentToken(token);
    return this.dataProviderClient.consumeMesri(input, token, route);
  }
}
