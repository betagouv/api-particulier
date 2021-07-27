import {ApplicationId} from 'src/domain/application-id';
import {TokenConsumed} from 'src/domain/data-fetching/events/token-consumed.event';
import {Entry} from 'src/domain/journal/entities/entry.entity';
import {EntryRepository} from 'src/domain/journal/repositories/entry.repository';

export class EntryProjector {
  constructor(private entryRepository: EntryRepository) {}

  async onTokenConsumed(event: TokenConsumed) {
    return this.entryRepository.save(
      new Entry(
        event.aggregateId as ApplicationId,
        event.date,
        event.subscription,
        event.route,
        event.statusCode,
        event.time
      )
    );
  }
}
