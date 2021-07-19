import {Client} from 'pg';
import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {UserSubscribed} from 'src/domain/application-management/events/user-subscribed.event';
import {Event} from 'src/domain/event';
import {EventStore} from 'src/domain/event-store';
import {logFor} from 'src/domain/logger';

export class PostgresEventStore implements EventStore {
  private readonly logger = logFor(PostgresEventStore.name);

  constructor(private readonly client: Client) {}

  async append(event: Event): Promise<void> {
    this.logger.log('debug', 'Appending event', {event});
    const insertQuery =
      'INSERT INTO events(aggregate_name, aggregate_id, created_at, event_name, payload) VALUES($1, $2, $3, $4, $5)';
    const values = [
      'Application',
      event.aggregateId,
      event.date,
      event.constructor.name,
      event,
    ];
    await this.client.query(insertQuery, values);
  }

  async listAggregateEvents(
    aggregate: string,
    aggregateId: string
  ): Promise<Event[]> {
    const selectQuery =
      'SELECT event_name, payload FROM events WHERE aggregate_name = $1 AND aggregate_id = $2 ORDER BY created_at';
    const {rows} = await this.client.query(selectQuery, [
      aggregate,
      aggregateId,
    ]);

    const events = rows.map(row => {
      switch (row.event_name) {
        case ApplicationCreated.name:
          return new ApplicationCreated(
            row.payload.applicationId,
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
            row.payload.applicationId,
            row.payload.date,
            row.payload.userEmail
          );
      }
      this.logger.log('error', `Read unknown event ${row.event_name}`, {row});
      throw new Error(`Unknown event ${row.event_name}`);
    });
    this.logger.log(
      'debug',
      `Listing events for aggregate ${aggregate} ${aggregateId}`,
      {events}
    );
    return events;
  }
}
