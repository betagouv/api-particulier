import {Client} from 'pg';
import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {EventStore} from 'src/domain/event-store';
import {PostgresEventStore} from 'src/infrastructure/postgres.event-store';
import * as dotenv from 'dotenv';
import pgMigrate from 'node-pg-migrate';
import {ApplicationId} from 'src/domain/application-id';
import {UserEmail} from 'src/domain/application-management/user';
import {TokenValue} from 'src/domain/token-value';

dotenv.config();

describe('The postgres event store', () => {
  let eventStore: EventStore;
  let client: Client;

  beforeAll(async () => {
    client = new Client(process.env.TEST_DATABASE_URL);
    await client.connect();
    await client.query(
      'DROP TABLE IF EXISTS events; DROP TABLE IF EXISTS pgmigrations; DROP TABLE IF EXISTS tokens;'
    );
    await pgMigrate({
      migrationsTable: 'pgmigrations',
      count: 1000,
      dir: process.cwd() + '/migrations',
      direction: 'up',
      databaseUrl: process.env.TEST_DATABASE_URL!,
      log: () => {},
    });
    eventStore = new PostgresEventStore(client);
  });

  afterAll(async () => {
    await client.end();
  });

  it('stores application events', async () => {
    const applicationCreated = new ApplicationCreated(
      '9d2b706c-7b3c-48ac-afdf-9d311533b656' as ApplicationId,
      new Date(),
      'Croute',
      '3',
      ['cnaf_adresse'],
      ['CNAF'],
      ['georges@moustaki.fr' as UserEmail],
      'token value' as TokenValue
    );

    expect(
      await eventStore.listAggregateEvents(
        'Application',
        applicationCreated.aggregateId
      )
    ).toHaveLength(0);
    await eventStore.append(applicationCreated);
    const eventList = await eventStore.listAggregateEvents(
      'Application',
      applicationCreated.aggregateId
    );
    expect(eventList).toHaveLength(1);
    expect(eventList[0]).toBeInstanceOf(ApplicationCreated);
  });
});
