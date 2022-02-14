import {some} from 'lodash';
import {UserEmail} from 'src/domain/application-management/user';
import {Scope} from 'src/domain/scopes';
import {Subscription} from 'src/domain/subscription';

export class CreateApplicationDto {
  readonly subscriptions: Subscription[];

  constructor(
    readonly name: string,
    readonly dataPassId: string,
    readonly scopes: Scope[],
    readonly userEmails: UserEmail[]
  ) {
    this.subscriptions = [];
    if (some(scopes, scope => scope.startsWith('dgfip'))) {
      this.subscriptions.push('DGFIP');
    }
    if (some(scopes, scope => scope.startsWith('cnaf'))) {
      this.subscriptions.push('CNAF');
    }
    if (some(scopes, scope => scope.startsWith('pole_emploi'))) {
      this.subscriptions.push('POLE_EMPLOI');
    }
    if (some(scopes, scope => scope.startsWith('mesri'))) {
      this.subscriptions.push('MESRI');
    }
    if (some(scopes, scope => scope.startsWith('cnous'))) {
      this.subscriptions.push('CNOUS');
    }
  }
}
