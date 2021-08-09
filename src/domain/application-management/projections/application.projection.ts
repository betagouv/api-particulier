import {ApplicationId} from 'src/domain/application-id';
import {UserEmail} from 'src/domain/application-management/user';
import {AnyScope} from 'src/domain/scopes';
import {Subscription} from 'src/domain/subscription';

export class ApplicationProjection {
  constructor(
    readonly id: ApplicationId,
    readonly name: string,
    readonly userEmails: UserEmail[],
    readonly scopes: AnyScope[],
    readonly subscriptions: Subscription[],
    readonly dataPassId: string,
    readonly createdAt: Date,
    readonly tokens: string[]
  ) {}
}
