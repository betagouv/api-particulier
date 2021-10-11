import {ApplicationId} from 'src/domain/application-id';
import {ApplicationRepository} from 'src/domain/application-management/repositories/application-entity.repository';
import {UserEmail} from 'src/domain/application-management/user';

export class SubscribeUserUsecase {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  async subscribe(userEmail: UserEmail, applicationId: ApplicationId) {
    const application = await this.applicationRepository.findById(
      applicationId
    );
    application.subscribeUser(userEmail);
    await this.applicationRepository.update(application);
  }
}
