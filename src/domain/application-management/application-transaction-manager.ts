import {EventBus} from 'src/domain/event-bus';
import {EventStore} from 'src/domain/event-store';
import {ApplicationId} from 'src/domain/application-id';
import {Application} from 'src/domain/application-management/application.aggregate';
import {ApplicationRepository} from 'src/domain/application-management/repositories/application.repository';
import {logFor} from 'src/domain/logger';

export class ApplicationTransactionManager {
  private readonly logger = logFor(ApplicationTransactionManager.name);

  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly eventBus: EventBus,
    private readonly eventStore: EventStore
  ) {}

  async apply(
    handler: (application: Application) => Application,
    applicationId: ApplicationId
  ) {
    let application = await this.applicationRepository.find(applicationId);
    this.logger.log(
      'debug',
      `Beginning transaction for application "${application.name}"`,
      {application}
    );
    application = handler(application);

    await Promise.all(
      application.getPendingEvents().map(event => {
        return this.eventBus.publish(event);
      })
    );
    this.logger.log(
      'debug',
      `End of transaction for application "${application.name}"`,
      {application}
    );

    return application;
  }

  async applyToNew(handler: () => Application) {
    this.logger.log('debug', 'Beginning transaction for new application');
    const application = handler();

    await Promise.all(
      application.getPendingEvents().map(async event => {
        await this.eventStore.append(event);
        await this.eventBus.publish(event);
      })
    );
    this.logger.log(
      'debug',
      `End of transaction for application "${application.name}"`,
      {application}
    );
    return application;
  }
}
