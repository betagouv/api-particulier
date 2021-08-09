import {MigrationBuilder, ColumnDefinitions} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('applications', {
    tokens: {
      type: 'jsonb',
      notNull: true,
      default: '[]',
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn('applications', 'tokens');
}
