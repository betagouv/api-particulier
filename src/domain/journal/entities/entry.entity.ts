import {Subscription} from 'src/domain/subscription';

export class Entry {
  constructor(
    readonly tokenId: string,
    readonly date: Date,
    readonly subscription: Subscription,
    readonly route: string,
    readonly statusCode: number,
    readonly time: number
  ) {}
}
