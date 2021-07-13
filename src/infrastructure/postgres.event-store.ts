import {Client} from 'pg';
import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {UserSubscribed} from 'src/domain/application-management/events/user-subscribed.event';
import {Event} from 'src/domain/event';
import {EventStore} from 'src/domain/event-store';

export class PostgresEventStore implements EventStore {
  constructor(private readonly client: Client) {}

  async append(event: Event): Promise<void> {
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

    return rows.map(row => {
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
      throw new Error(`Unknown event ${row.event_name}`);
    });
  }
}
