import * as dotenv from 'dotenv';
dotenv.config();
import {Command} from 'commander';
import {Client} from 'pg';
import {ApplicationId} from 'src/domain/application-id';
import {postgresClient as mainPgClient} from 'src/infrastructure/service-container';

const listAlreadyImportedApplicationIds = async (pg: Client) => {
  const result = await pg.query(
    "SELECT DISTINCT aggregate_id FROM events WHERE aggregate_name = 'Application'"
  );
  return result.rows as ApplicationId[];
};

(async () => {
  const program = new Command();
  program.version('0.0.1');
  program.requiredOption(
    '-g, --gravitee-db-url <url>',
    'gravitee database url'
  );
  program.parse(process.argv);

  const options = program.opts();
  const graviteeDbUrl = options.graviteeDbUrl;
  const graviteePgClient = new Client(graviteeDbUrl);
  await graviteePgClient.connect();
  console.log('Connected to Gravitee database');
  await mainPgClient.connect();
  console.log('Connected to main database');

  console.log(await listAlreadyImportedApplicationIds(mainPgClient));

  await graviteePgClient.end();
  await mainPgClient.end();
  console.log('Disconnected');
  // eslint-disable-next-line no-process-exit
  process.exit(0);
})();
