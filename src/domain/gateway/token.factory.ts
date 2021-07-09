import {Token} from 'src/domain/gateway/token';

export interface TokenFactory {
  generateToken(): Token;
}
