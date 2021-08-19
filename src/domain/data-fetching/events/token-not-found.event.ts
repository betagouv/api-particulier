import {Event} from 'src/domain/event';
import {TokenValue} from 'src/domain/token-value';

export class TokenNotFound implements Event {
  constructor(readonly tokenValue: TokenValue) {}
}
