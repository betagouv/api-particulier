import * as dotenv from 'dotenv';
dotenv.config();
import {Command} from 'commander';
import {postgresPool} from 'src/infrastructure/configuration/postgres';
import {PostgresEventStore} from 'src/infrastructure/postgres.event-store';
import {EventEmitterEventBus} from 'src/infrastructure/event-bus/event-emitter.event-bus';

(async () => {
  const program = new Command();
  program.version('0.0.1');
  program.parse(process.argv);

  const eventStore = new PostgresEventStore(postgresPool);
  const eventBus = new EventEmitterEventBus();
  const events = await eventStore.listEvents();

  console.log('Removing projections');

  await postgresPool.query('DELETE FROM applications');
  await postgresPool.query('DELETE FROM tokens');

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
