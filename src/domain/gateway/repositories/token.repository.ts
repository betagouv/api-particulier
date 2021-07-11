import {Token} from 'src/domain/gateway/projections/token';
import {TokenValue} from 'src/domain/token-value';

export interface TokenRepository {
  findByTokenValue(tokenValue: TokenValue): Promise<Token>;

  save(token: Token): void;
}
