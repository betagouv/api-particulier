import {MigrationBuilder, ColumnDefinitions} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('applications', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },
    name: {type: 'varchar(200)', notNull: true},
    data_pass_id: {type: 'varchar(200)', notNull: true},
    created_at: {type: 'timestamptz', notNull: true},
    user_emails: {
      type: 'jsonb',
      notNull: true,
    },
    scopes: {
      type: 'jsonb',
      notNull: true,
    },
    subscriptions: {
      type: 'jsonb',
      notNull: true,
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('applications');
}
