import {ApplicationId} from 'src/domain/application-id';
import {Application} from 'src/domain/application-management/application.aggregate';
import {ApplicationRepository} from 'src/domain/application-management/repositories/application.repository';
import {EventStore} from 'src/domain/event-store';
import {logFor} from 'src/domain/logger';

export class EventSourcedApplicationRepository
  implements ApplicationRepository
{
  private readonly logger = logFor(EventSourcedApplicationRepository.name);

  constructor(private readonly eventStore: EventStore) {}
  async find(id: ApplicationId): Promise<Application> {
    this.logger.log('debug', `Finding application "${id}"`);

    const events = await this.eventStore.listAggregateEvents(
      Application.name,
      id
    );

    const application = Application.fromEvents(events) as Application;
    this.logger.log('debug', `Found application "${id}"`, {application});

    return application;
  }
}
