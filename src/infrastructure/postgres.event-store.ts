import {Pool} from 'pg';
import {AggregateEvent} from 'src/domain/aggregate-event';
import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {ApplicationImported} from 'src/domain/application-management/events/application-imported.event';
import {UserSubscribed} from 'src/domain/application-management/events/user-subscribed.event';
import {EventStore} from 'src/domain/event-store';
import {logFor} from 'src/domain/logger';

export class PostgresEventStore implements EventStore {
  private readonly logger = logFor(PostgresEventStore.name);

  constructor(private readonly pool: Pool) {}

  async append(event: AggregateEvent): Promise<void> {
    this.logger.log(
      'debug',
      `Appending event ${event.constructor.name} to Postgres`,
      {event}
    );
    const insertQuery =
      'INSERT INTO events(aggregate_name, aggregate_id, created_at, event_name, payload) VALUES($1, $2, $3, $4, $5)';
    const values = [
      'Application',
      event.aggregateId,
      event.date,
      event.constructor.name,
      event,
    ];
    await this.pool.query(insertQuery, values);
  }

  async listAggregateEvents(
    aggregate: string,
    aggregateId: string
  ): Promise<AggregateEvent[]> {
    const selectQuery =
      'SELECT event_name, payload FROM events WHERE aggregate_name = $1 AND aggregate_id = $2 ORDER BY created_at';
    const {rows} = await this.pool.query(selectQuery, [aggregate, aggregateId]);

    const events = this.constructEventsFromRows(rows);

    this.logger.log(
      'debug',
      `Listing events for aggregate ${aggregate} ${aggregateId}`,
      {events}
    );
    return events;
  }

  async listEvents(): Promise<AggregateEvent[]> {
    const selectQuery =
      'SELECT event_name, payload FROM events ORDER BY created_at';
    const {rows} = await this.pool.query(selectQuery, []);

    const events = this.constructEventsFromRows(rows);

    this.logger.log('debug', 'Listing all events');
    return events;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private constructEventsFromRows(rows: any[]): AggregateEvent[] {
    return rows.map(row => {
      switch (row.event_name) {
        case ApplicationImported.name:
          return new ApplicationImported(
            row.payload.aggregateId,
            row.payload.date,
            row.payload.name,
            row.payload.dataPassId,
            row.payload.scopes,
            row.payload.subscriptions,
            row.payload.userEmails,
            row.payload.tokens
          );
        case ApplicationCreated.name:
          return new ApplicationCreated(
            row.payload.aggregateId,
            row.payload.date,
            row.payload.name,
            row.payload.dataPassId,
            row.payload.scopes,
            row.payload.subscriptions,
            row.payload.userEmails,
            row.payload.tokenValue
          );
        case UserSubscribed.name:
          return new UserSubscribed(
            row.payload.aggregateId,
            row.payload.date,
            row.payload.userEmail
          );
      }
      throw new Error(`Unknown event ${row.event_name}`);
    });
  }
}
