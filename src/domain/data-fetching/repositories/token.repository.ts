import {ApplicationId} from 'src/domain/application-id';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenValue} from 'src/domain/token-value';

export interface TokenRepository {
  findByTokenValue(tokenValue: TokenValue): Promise<Token>;

  save(token: Token): Promise<void>;

  removeByApplicationId(id: ApplicationId): Promise<void>;
}
