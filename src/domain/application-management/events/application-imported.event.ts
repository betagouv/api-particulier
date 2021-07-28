import {AnyScope} from 'src/domain/scopes';
import {UserEmail} from 'src/domain/application-management/user';
import {Subscription} from 'src/domain/subscription';
import {Event} from 'src/domain/event';
import {Token} from 'src/domain/application-management/application.aggregate';

export class ApplicationImported implements Event {
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
