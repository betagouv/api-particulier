import {Event} from 'src/domain/event';

export class ResponseSent implements Event {
  constructor(
    readonly aggregateId: string,
    readonly date: Date,
    readonly route: string,
    readonly params: object,
    readonly headers: object,
    readonly statusCode: number,
    readonly data: object
  ) {}
}
