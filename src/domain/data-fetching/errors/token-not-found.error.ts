import {TokenValue} from 'src/domain/token-value';

export class TokenNotFoundError extends Error {
  constructor(readonly tokenValue: TokenValue) {
    super(`Unable to find token ${tokenValue}`);
  }
}
