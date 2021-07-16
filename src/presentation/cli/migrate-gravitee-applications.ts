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
  SELECT app.id as application_id, app.name as application_name, app.description as application_description, array_agg(scopes_md.value) as scopes, array_agg(legacy_md.value) as legacy_token_hash, array_agg(k.key) as token, array_agg(users.email) as user_email
  FROM applications app
  INNER JOIN metadata scopes_md ON scopes_md.reference_id = app.id AND scopes_md.key = 'scopes'
  LEFT OUTER JOIN metadata legacy_md ON legacy_md.reference_id = app.id AND legacy_md.key = 'legacy-token-hash'
  FULL OUTER JOIN "keys" k ON k.application = app.id AND k.revoked = false AND k.paused = false
  INNER JOIN memberships ON memberships.reference_id = app.id
  INNER JOIN users ON users.id = memberships.member_id
  WHERE app.status = 'ACTIVE'
  GROUP BY app.id
`);
  return result.rows.map(row => {
    const dataPassIdMatch = row.application_description.match(
      /Numéro de demande : ([0-9]+)/
    );
    const dataPassId = dataPassIdMatch ? dataPassIdMatch[1] : '';

    const scopes = row.scopes[0].split(',');

    const subscriptions = [];
    if (row.scopes[0].indexOf('dgfip') !== -1) {
      subscriptions.push('DGFIP');
    }
    if (row.scopes[0].indexOf('cnaf') !== -1) {
      subscriptions.push('CNAF');
    }
    const filteredLegacyTokenHash = row.legacy_token_hash.filter(
      (hash: string) => hash !== null
    );
    const filteredToken = row.token.filter((token: string) => token !== null);
    const tokenValue =
      filteredLegacyTokenHash.length > 0
        ? filteredLegacyTokenHash[0]
        : filteredToken[0];
    return {
      applicationId: row.application_id,
      applicationName: row.application_name.replace(/ - [0-9]+$/, ''),
      dataPassId,
      scopes,
      subscriptions,
      userEmails: Array.from(
        new Set(row.user_email.filter((email: string) => email !== null))
      ),
      tokenValue,
    };
  });
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
