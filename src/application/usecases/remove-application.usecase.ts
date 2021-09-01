import {ApplicationId} from 'src/domain/application-id';
import {ApplicationTransactionManager} from 'src/domain/application-management/application-transaction-manager';
import {UserEmail} from 'src/domain/application-management/user';

export class RemoveApplicationUsecase {
  constructor(
    private readonly applicationTransactionManager: ApplicationTransactionManager
  ) {}

  async subscribe(userEmail: UserEmail, applicationId: ApplicationId) {
    await this.applicationTransactionManager.apply(application => {
      application.remove();
      return application;
    }, applicationId);
  }
}
