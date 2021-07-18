/* eslint-disable @typescript-eslint/camelcase */
import {MigrationBuilder, ColumnDefinitions} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('tokens', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    application_id: {type: 'uuid', notNull: true},
    value: {type: 'varchar(200)', notNull: true},
    scopes: {
      type: 'jsonb',
      notNull: true,
    },
    subscriptions: {
      type: 'jsonb',
      notNull: true,
    },
  });
  pgm.createIndex('tokens', 'value');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('tokens');
}
