import {TokenValue} from 'src/domain/gateway/token-value';

export interface TokenValueFactory {
  generateTokenValue(): TokenValue;
}
