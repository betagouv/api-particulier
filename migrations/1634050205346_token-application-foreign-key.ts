import {MigrationBuilder, ColumnDefinitions} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn('applications', ['tokens', 'scopes', 'subscriptions']);
  pgm.addConstraint('tokens', 'application-token-foreign-key', {
    foreignKeys: {
      columns: 'application_id',
      references: 'applications',
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('applications', {
    tokens: {
      type: 'jsonb',
      notNull: true,
      default: '[]',
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
  pgm.dropConstraint('tokens', 'application-token-foreign-key');
}
