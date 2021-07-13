import {DataProviderClient} from 'src/domain/data-fetching/data-provider-client';
import {CnafInput} from 'src/domain/data-fetching/data-providers/cnaf/dto';
import {DgfipInput} from 'src/domain/data-fetching/data-providers/dgfip/dto';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {TokenValue} from 'src/domain/token-value';

export class FetchDataUsecase {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly dataProviderClient: DataProviderClient
  ) {}

  async fetchDgfipData(
    tokenValue: TokenValue,
    input: DgfipInput,
    route: string
  ) {
    const token = await this.tokenRepository.findByTokenValue(tokenValue);
    return this.dataProviderClient.consumeDgfip(input, token, route);
  }

  async fetchCnafData(tokenValue: TokenValue, input: CnafInput, route: string) {
    const token = await this.tokenRepository.findByTokenValue(tokenValue);
    return this.dataProviderClient.consumeCnaf(input, token, route);
  }
}
