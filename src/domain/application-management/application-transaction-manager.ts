import {EventBus} from 'src/domain/event-bus';
import {EventStore} from 'src/domain/event-store';
import {ApplicationId} from 'src/domain/application-id';
import {Application} from 'src/domain/application-management/application.aggregate';
import {ApplicationRepository} from 'src/domain/application-management/repositories/application.repository';

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

    return Promise.all(
      application.getPendingEvents().map(async event => {
        await this.eventStore.append(event);
        this.eventBus.publish(event);
      })
    );
  }
}
