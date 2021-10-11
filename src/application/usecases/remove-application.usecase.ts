import {ApplicationId} from 'src/domain/application-id';
import {ApplicationRemoved} from 'src/domain/application-management/events/application-removed.event';
import {ApplicationRepository} from 'src/domain/application-management/repositories/application-entity.repository';
import {EventBus} from 'src/domain/event-bus';

export class RemoveApplicationUsecase {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly eventBus: EventBus
  ) {}

  async remove(applicationId: ApplicationId) {
    await this.applicationRepository.remove(applicationId);
    this.eventBus.publish(new ApplicationRemoved(applicationId, new Date()));
  }
}
