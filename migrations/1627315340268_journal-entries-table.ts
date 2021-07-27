import {MigrationBuilder, ColumnDefinitions} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('journal_entries', {
    date: {type: 'timestamptz', primaryKey: true, notNull: true},
    application_id: {type: 'uuid', notNull: true},
    subscription: {type: 'varchar(100)', notNull: true},
    route: {type: 'varchar(100)', notNull: true},
    status_code: {type: 'integer', notNull: true},
    time: {type: 'integer', notNull: true},
  });
  pgm.createIndex('journal_entries', 'application_id');
  pgm.sql('CREATE EXTENSION IF NOT EXISTS timescaledb;');
  pgm.sql("SELECT create_hypertable('journal_entries', 'date')");
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('journal_entrie');
}
