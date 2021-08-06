import {DataProviderClient} from 'src/domain/data-fetching/data-provider-client';
import {CnafInput} from 'src/domain/data-fetching/data-providers/cnaf/dto';
import {DgfipInput} from 'src/domain/data-fetching/data-providers/dgfip/dto';
import {PoleEmploiInput} from 'src/domain/data-fetching/data-providers/pole-emploi/dto';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {TokenNotFound} from 'src/domain/data-fetching/events/token-not-found.event';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {EventBus} from 'src/domain/event-bus';
import {TokenValue} from 'src/domain/token-value';

export class FetchDataUsecase {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly dataProviderClient: DataProviderClient,
    private readonly eventBus: EventBus
  ) {}

  async fetchDgfipData(
    tokenValue: TokenValue,
    input: DgfipInput,
    route: string,
    setCurrentToken: (token: Token) => void
  ) {
    try {
      const token = await this.tokenRepository.findByTokenValue(tokenValue);
      setCurrentToken(token);
      return this.dataProviderClient.consumeDgfip(input, token, route);
    } catch (error) {
      if (error instanceof TokenNotFoundError) {
        await this.eventBus.publish(
          new TokenNotFound('', new Date(), tokenValue)
        );
      }
      throw error;
    }
  }

  async fetchCnafData(
    tokenValue: TokenValue,
    input: CnafInput,
    route: string,
    setCurrentToken: (token: Token) => void
  ) {
    try {
      const token = await this.tokenRepository.findByTokenValue(tokenValue);
      setCurrentToken(token);
      return this.dataProviderClient.consumeCnaf(input, token, route);
    } catch (error) {
      if (error instanceof TokenNotFoundError) {
        await this.eventBus.publish(
          new TokenNotFound('', new Date(), tokenValue)
        );
      }
      throw error;
    }
  }

  async fetchPoleEmploiData(
    tokenValue: TokenValue,
    input: PoleEmploiInput,
    route: string,
    setCurrentToken: (token: Token) => void
  ) {
    try {
      const token = await this.tokenRepository.findByTokenValue(tokenValue);
      setCurrentToken(token);
      return this.dataProviderClient.consumePoleEmploi(input, token, route);
    } catch (error) {
      if (error instanceof TokenNotFoundError) {
        await this.eventBus.publish(
          new TokenNotFound('', new Date(), tokenValue)
        );
      }
      throw error;
    }
  }
}
