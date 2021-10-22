import {TokenValue} from 'src/domain/token-value';

export type TokenType = 'api-key' | 'access-token';

export type Credentials = {
  tokenValue: TokenValue;
  type: TokenType;
};
