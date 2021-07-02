import {ApiKey} from 'src/domain/administration/api-key';
import {Token} from 'src/domain/administration/token';

export interface TokenFactory {
  generateToken(): [Token, ApiKey];
}
