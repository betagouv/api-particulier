import {some} from 'lodash';
import {UserEmail} from 'src/domain/application-management/user';
import {AnyScope} from 'src/domain/scopes';
import {Subscription} from 'src/domain/subscription';

export class CreateApplicationDto {
  readonly subscriptions: Subscription[];

  constructor(
    readonly name: string,
    readonly dataPassId: string,
    readonly scopes: AnyScope[],
    readonly userEmails: UserEmail[]
  ) {
    this.subscriptions = [];
    if (some(scopes, scope => scope.startsWith('dgfip'))) {
      this.subscriptions.push('DGFIP');
    }
    if (some(scopes, scope => scope.startsWith('cnaf'))) {
      this.subscriptions.push('CNAF');
    }
  }
}
