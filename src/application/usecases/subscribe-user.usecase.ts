import {ApplicationId} from 'src/domain/application-id';
import {ApplicationTransactionManager} from 'src/domain/application-management/application-transaction-manager';
import {UserEmail} from 'src/domain/application-management/user';

export class SubscribeUserUsecase {
  constructor(
    private readonly applicationTransactionManager: ApplicationTransactionManager
  ) {}

  async subscribe(userEmail: UserEmail, applicationId: ApplicationId) {
    await this.applicationTransactionManager.apply(application => {
      application.subscribeUser(userEmail);
      return application;
    }, applicationId);
  }
}
