import {ApplicationId} from 'src/domain/application-id';
import {Event} from 'src/domain/event';
import {Subscription} from 'src/domain/subscription';

export class TokenConsumed extends Event {
  constructor(
    applicationId: ApplicationId,
    date: Date,
    readonly subscription: Subscription,
    readonly route: string,
    readonly statusCode: number,
    readonly time: number
  ) {
    super(applicationId, date);
  }
}
