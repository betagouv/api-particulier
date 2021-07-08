import {ApiKey} from 'src/domain/gateway/api-key';
import {Token} from 'src/domain/gateway/token';

export interface TokenFactory {
  generateToken(): [Token, ApiKey];
}
