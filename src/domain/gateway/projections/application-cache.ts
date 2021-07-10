import {ApplicationId} from 'src/domain/gateway/application-id';
import {Subscription} from 'src/domain/gateway/application.aggregate';
import {AnyScope} from 'src/domain/gateway/scopes';
import {Token} from 'src/domain/gateway/token';
import {UserEmail} from 'src/domain/gateway/user';

export class ApplicationCache {
  constructor(
    public readonly tokenValue: string,
    public id: ApplicationId,
    public name: string,
    public scopes: AnyScope[],
    public subscriptions: Subscription[],
    public tokens: Token[],
    public readonly createdOn: Date,
    public userEmails: UserEmail[],
    public readonly dataPassId: string
  ) {}
}
