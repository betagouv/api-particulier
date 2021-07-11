import {Token} from 'src/domain/gateway/projections/token';
import {TokenValue} from 'src/domain/gateway/token-value';

export interface TokenRepository {
  findByTokenValue(tokenValue: TokenValue): Promise<Token>;
}
