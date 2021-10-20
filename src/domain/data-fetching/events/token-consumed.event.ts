import {Event} from 'src/domain/event';
import {Subscription} from 'src/domain/subscription';

export class TokenConsumed implements Event {
  constructor(
    readonly date: Date,
    readonly tokenId: string,
    readonly subscription: Subscription,
    readonly route: string,
    readonly statusCode: number,
    readonly time: number
  ) {}
}
