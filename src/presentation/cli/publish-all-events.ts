import * as dotenv from 'dotenv';
dotenv.config();
import {Command} from 'commander';
import {postgresPool} from 'src/infrastructure/configuration/postgres';
import {eventBus, eventStore} from 'src/infrastructure/service-container';

(async () => {
  const program = new Command();
  program.version('0.0.1');
  program.parse(process.argv);

  const events = await eventStore.listEvents();

  console.log('Removing projections');

  await postgresPool.query('DELETE FROM applications');
  await postgresPool.query('DELETE FROM tokens');

  console.log(`Publishing ${events.length} events`);

  events.forEach(event => {
    eventBus.publish(event);
  });

  setTimeout(async () => {
    await postgresPool.end();
    console.log('Disconnected');
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  }, 3000);
})();
