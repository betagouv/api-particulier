import {AnyScope} from 'src/domain/scopes';
import {TokenValue} from 'src/domain/token-value';
import {UserEmail} from 'src/domain/application-management/user';
import {Subscription} from 'src/domain/subscription';
import {Event} from 'src/domain/event';

export class ApplicationCreated implements Event {
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
