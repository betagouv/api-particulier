import {MigrationBuilder, ColumnDefinitions} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.noTransaction();

  pgm.sql(`
      SELECT remove_retention_policy('journal_entries');
    `);
  pgm.sql(`
      SELECT remove_retention_policy('consumptions_summary_hourly');
    `);
  pgm.dropMaterializedView('consumptions_summary_hourly');
  pgm.dropMaterializedView('consumptions_summary_daily');

  pgm.renameColumn('journal_entries', 'application_id', 'token_id');

  pgm.sql(`
    CREATE MATERIALIZED VIEW consumptions_summary_hourly
    WITH (timescaledb.continuous) AS
    SELECT token_id, subscription, route, status_code,
       time_bucket(INTERVAL '1 hour', date) AS bucket,
       AVG(time) as avg_time,
       MAX(time) as max_time,
       MIN(time) as min_time,
       count(*) as count
    FROM journal_entries
    GROUP BY token_id, subscription, route, status_code, bucket;
  `);
  pgm.sql(`
    SELECT add_continuous_aggregate_policy('consumptions_summary_hourly',
        start_offset => INTERVAL '3 h',
        end_offset => INTERVAL '1 h',
        schedule_interval => INTERVAL '1 h');
  `);
  pgm.sql(`
    CREATE MATERIALIZED VIEW consumptions_summary_daily
    WITH (timescaledb.continuous) AS
    SELECT token_id, subscription, route, status_code,
       time_bucket(INTERVAL '1 day', date) AS bucket,
       AVG(time) as avg_time,
       MAX(time) as max_time,
       MIN(time) as min_time,
       count(*) as count
    FROM journal_entries
    GROUP BY token_id, subscription, route, status_code, bucket;
  `);
  pgm.sql(`
    SELECT add_continuous_aggregate_policy('consumptions_summary_daily',
        start_offset => INTERVAL '3 days',
        end_offset => INTERVAL '1 day',
        schedule_interval => INTERVAL '1 day');
  `);
  pgm.sql(`
    SELECT add_retention_policy('journal_entries', INTERVAL '10 days');
  `);
  pgm.sql(`
    SELECT add_retention_policy('consumptions_summary_hourly', INTERVAL '1 month');
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.noTransaction();

  pgm.sql(`
        SELECT remove_retention_policy('journal_entries');
      `);
  pgm.sql(`
        SELECT remove_retention_policy('consumptions_summary_hourly');
      `);
  pgm.dropMaterializedView('consumptions_summary_hourly');
  pgm.dropMaterializedView('consumptions_summary_daily');

  pgm.renameColumn('journal_entries', 'token_id', 'application_id');

  pgm.sql(`
    CREATE MATERIALIZED VIEW consumptions_summary_hourly
    WITH (timescaledb.continuous) AS
    SELECT application_id, subscription, route, status_code,
       time_bucket(INTERVAL '1 hour', date) AS bucket,
       AVG(time) as avg_time,
       MAX(time) as max_time,
       MIN(time) as min_time,
       count(*) as count
    FROM journal_entries
    GROUP BY application_id, subscription, route, status_code, bucket;
  `);
  pgm.sql(`
    SELECT add_continuous_aggregate_policy('consumptions_summary_hourly',
        start_offset => INTERVAL '3 h',
        end_offset => INTERVAL '1 h',
        schedule_interval => INTERVAL '1 h');
  `);
  pgm.sql(`
    CREATE MATERIALIZED VIEW consumptions_summary_daily
    WITH (timescaledb.continuous) AS
    SELECT application_id, subscription, route, status_code,
       time_bucket(INTERVAL '1 day', date) AS bucket,
       AVG(time) as avg_time,
       MAX(time) as max_time,
       MIN(time) as min_time,
       count(*) as count
    FROM journal_entries
    GROUP BY application_id, subscription, route, status_code, bucket;
  `);
  pgm.sql(`
    SELECT add_continuous_aggregate_policy('consumptions_summary_daily',
        start_offset => INTERVAL '3 days',
        end_offset => INTERVAL '1 day',
        schedule_interval => INTERVAL '1 day');
  `);
  pgm.sql(`
    SELECT add_retention_policy('journal_entries', INTERVAL '10 days');
  `);
  pgm.sql(`
    SELECT add_retention_policy('consumptions_summary_hourly', INTERVAL '1 month');
  `);
}
