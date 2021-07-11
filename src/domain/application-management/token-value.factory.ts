import {TokenValue} from 'src/domain/token-value';

export interface TokenValueFactory {
  generateTokenValue(): TokenValue;
}
