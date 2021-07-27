import {Entry} from 'src/domain/journal/entities/entry.entity';

export interface EntryRepository {
  save(entry: Entry): Promise<void>;
}
