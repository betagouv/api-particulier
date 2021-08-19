import {AnyScope} from 'src/domain/scopes';
import {TokenValue} from 'src/domain/token-value';
import {UserEmail} from 'src/domain/application-management/user';
import {Subscription} from 'src/domain/subscription';
import {AggregateEvent} from 'src/domain/aggregate-event';

export class ApplicationCreated implements AggregateEvent {
  constructor(
    readonly aggregateId: string,
    readonly date: Date,
    readonly name: string,
    readonly dataPassId: string,
    readonly scopes: AnyScope[],
    readonly subscriptions: Subscription[],
    readonly userEmails: UserEmail[],
    readonly tokenValue: TokenValue
  ) {}
}
