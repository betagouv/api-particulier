import * as dotenv from 'dotenv';
dotenv.config();
import {Command} from 'commander';
import {postgresPool} from 'src/infrastructure/configuration/postgres';
import {BullEventBus} from 'src/infrastructure/event-bus/bull.event-bus';
import {PostgresEventStore} from 'src/infrastructure/postgres.event-store';
import {redisConnection} from 'src/infrastructure/configuration/redis';

(async () => {
  const program = new Command();
  program.version('0.0.1');
  program.parse(process.argv);

  const eventStore = new PostgresEventStore(postgresPool);
  const eventBus = new BullEventBus(redisConnection);
  const events = await eventStore.listEvents();

  console.log(`Publishing ${events.length} events`);

  await Promise.all(
    events.map(event => {
      return eventBus.publish(event);
    })
  );

  await postgresPool.end();
  console.log('Disconnected');
  // eslint-disable-next-line no-process-exit
  process.exit(0);
})();
