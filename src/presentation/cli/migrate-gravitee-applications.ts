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

const getApplicationToImport = async (pg: Client) => {
  const result = await pg.query(`
  SELECT app.id as application_id, app.name as application_name, app.description as application_description, scopes_md.value as scopes, legacy_md.value as legacy_token_hash, k.key as token, users.email as user_email
  FROM applications app
  INNER JOIN metadata scopes_md ON scopes_md.reference_id = app.id AND scopes_md.key = 'scopes'
  LEFT OUTER JOIN metadata legacy_md ON legacy_md.reference_id = app.id AND legacy_md.key = 'legacy-token-hash'
  FULL OUTER JOIN "keys" k ON k.application = app.id AND k.revoked = false AND k.paused = false
  INNER JOIN memberships ON memberships.reference_id = app.id
  INNER JOIN users ON users.id = memberships.member_id
  WHERE app.status = 'ACTIVE'
`);
  const applicationUsers = result.rows.reduce((acc, row) => {
    if (!acc[row.application_id]) {
      acc[row.application_id] = [];
    }
    if (
      row.user_email !== null &&
      acc[row.application_id].indexOf(row.user_email) === -1
    ) {
      acc[row.application_id].push(row.user_email);
    }
    return acc;
  }, {});
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

  await getApplicationToImport(graviteePgClient);

  await graviteePgClient.end();
  await mainPgClient.end();
  console.log('Disconnected');
  // eslint-disable-next-line no-process-exit
  process.exit(0);
})();
