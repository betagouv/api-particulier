import {ApplicationId} from 'src/domain/application-id';
import {ApplicationTransactionManager} from 'src/domain/application-management/application-transaction-manager';

export class RemoveApplicationUsecase {
  constructor(
    private readonly applicationTransactionManager: ApplicationTransactionManager
  ) {}

  async remove(applicationId: ApplicationId) {
    await this.applicationTransactionManager.apply(application => {
      application.remove();
      return application;
    }, applicationId);
  }
}
