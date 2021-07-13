import {MigrationBuilder, ColumnDefinitions} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('events', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    aggregate_name: {type: 'varchar(100)', notNull: true},
    aggregate_id: {type: 'uuid', notNull: true},
    created_at: {
      type: 'timestamptz',
      notNull: true,
    },
    event_name: {type: 'varchar(100)', notNull: true},
    payload: {
      type: 'jsonb',
      notNull: true,
    },
  });
  pgm.createIndex('events', 'aggregate_id');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('events');
}
