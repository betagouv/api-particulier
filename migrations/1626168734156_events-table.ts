import {MigrationBuilder, ColumnDefinitions} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('events', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    aggregateName: {type: 'varchar(100)', notNull: true},
    aggregateId: {type: 'uuid', notNull: true},
    createdAt: {
      type: 'timestamptz',
      notNull: true,
    },
    eventName: {type: 'varchar(100)', notNull: true},
    payload: {
      type: 'jsonb',
      notNull: true,
    },
  });
  pgm.createIndex('events', 'aggregateId');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('events');
}
