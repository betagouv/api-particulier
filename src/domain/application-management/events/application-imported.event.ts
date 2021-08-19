import {AnyScope} from 'src/domain/scopes';
import {UserEmail} from 'src/domain/application-management/user';
import {Subscription} from 'src/domain/subscription';
import {Token} from 'src/domain/application-management/application.aggregate';
import {AggregateEvent} from 'src/domain/aggregate-event';

export class ApplicationImported implements AggregateEvent {
  constructor(
    readonly aggregateId: string,
    readonly date: Date,
    readonly name: string,
    readonly dataPassId: string,
    readonly scopes: AnyScope[],
    readonly subscriptions: Subscription[],
    readonly userEmails: UserEmail[],
    readonly tokens: Token[]
  ) {}
}
