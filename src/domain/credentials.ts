import {TokenValue} from 'src/domain/token-value';

export type Credentials = {
  tokenValue: TokenValue;
  type: 'api-key' | 'access-token';
};
