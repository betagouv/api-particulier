import {ApplicationId} from 'src/domain/application-id';
import {Application} from 'src/domain/application-management/application.aggregate';
import {ApplicationRepository} from 'src/domain/application-management/repositories/application.repository';
import {EventStore} from 'src/domain/event-store';

export class EventSourcedApplicationRepository
  implements ApplicationRepository
{
  constructor(private readonly eventStore: EventStore) {}
  async find(id: ApplicationId): Promise<Application> {
    const events = await this.eventStore.listAggregateEvents(
      Application.name,
      id
    );

    return Application.fromEvents(events) as Application;
  }
}
