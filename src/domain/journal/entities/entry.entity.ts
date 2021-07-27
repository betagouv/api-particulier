import {ApplicationId} from 'src/domain/application-id';
import {Subscription} from 'src/domain/subscription';

export class Entry {
  constructor(
    readonly applicationId: ApplicationId,
    readonly date: Date,
    readonly subscription: Subscription,
    readonly route: string,
    readonly statusCode: number,
    readonly time: number
  ) {}
}
