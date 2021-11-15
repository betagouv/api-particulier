import {Pool} from 'pg';
import {Entry} from 'src/domain/journal/entities/entry.entity';
import {EntryRepository} from 'src/domain/journal/repositories/entry.repository';

export class PostgresEntryRepository implements EntryRepository {
  constructor(private readonly pg: Pool) {}

  async save(entry: Entry): Promise<void> {
    const query =
      'INSERT INTO journal_entries(date, token_id, subscription, route, status_code, time, payload) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const values = [
      entry.date,
      entry.tokenId,
      entry.subscription,
      entry.route,
      entry.statusCode,
      entry.time,
      JSON.stringify(entry.payload),
    ];

    await this.pg.query(query, values);
    return;
  }
}
