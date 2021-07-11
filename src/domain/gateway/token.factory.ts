import {TokenValue} from 'src/domain/gateway/token-value';

export interface TokenFactory {
  generateToken(): TokenValue;
}
