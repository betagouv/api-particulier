import {ApplicationId} from 'src/domain/application-id';
import {Token, UnsavedToken} from 'src/domain/data-fetching/projections/token';
import {TokenValue} from 'src/domain/token-value';

export interface TokenRepository {
  findByTokenValue(tokenValue: TokenValue): Promise<Token>;

  save(token: UnsavedToken): Promise<void>;

  removeByApplicationId(id: ApplicationId): Promise<void>;
}
