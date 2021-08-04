import * as dotenv from 'dotenv';
dotenv.config();
import {Command} from 'commander';
import {eventBus, eventStore} from 'src/infrastructure/service-container';
import {pgPool} from 'test/integration/config';

(async () => {
  const program = new Command();
  program.version('0.0.1');
  program.parse(process.argv);

  const events = await eventStore.listEvents();

  console.log(`Publishing ${events.length} events`);

  await Promise.all(
    events.map(event => {
      return eventBus.publish(event);
    })
  );

  await pgPool.end();
  console.log('Disconnected');
  // eslint-disable-next-line no-process-exit
  process.exit(0);
})();
