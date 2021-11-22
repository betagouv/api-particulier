import {TokenConsumed} from 'src/domain/data-fetching/events/token-consumed.event';
import {Anonymizer} from 'src/domain/journal/anonymizer';
import {Entry} from 'src/domain/journal/entities/entry.entity';
import {EntryRepository} from 'src/domain/journal/repositories/entry.repository';

export class EntryProjector {
  constructor(
    private entryRepository: EntryRepository,
    private anonymizer: Anonymizer
  ) {}

  async onTokenConsumed(event: TokenConsumed) {
    return this.entryRepository.save(
      new Entry(
        event.tokenId,
        event.date,
        event.subscription,
        event.route,
        event.statusCode,
        event.time,
        this.anonymizer.anonymizePayload(event.payload),
        event.ip
      )
    );
  }
}
