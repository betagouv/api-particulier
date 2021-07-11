import {EventBus} from 'src/domain/event-bus';
import {EventStore} from 'src/domain/event-store';
import {ApplicationId} from 'src/domain/gateway/application-id';
import {Application} from 'src/domain/gateway/application.aggregate';
import {ApplicationRepository} from 'src/domain/gateway/repositories/application.repository';

export class ApplicationTransactionManager {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly eventBus: EventBus,
    private readonly eventStore: EventStore
  ) {}

  async apply(
    handler: (application: Application) => Application,
    applicationId: ApplicationId
  ): Promise<void> {
    let application = await this.applicationRepository.find(applicationId);
    application = handler(application);

    application.getPendingEvents().forEach(event => {
      this.eventBus.publish(event);
    });
  }

  async applyToNew(handler: () => Application) {
    const application = handler();

    application.getPendingEvents().forEach(event => {
      this.eventStore.append(event);
      this.eventBus.publish(event);
    });
  }
}
