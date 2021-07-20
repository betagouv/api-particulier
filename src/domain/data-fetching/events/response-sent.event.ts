import {Event} from 'src/domain/event';

export class ResponseSent implements Event {
  constructor(
    readonly aggregateId: string,
    readonly date: Date,
    readonly route: string,
    readonly statusCode: number,
    readonly data: object
  ) {}
}
