import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = {
  payload: {type: 'jsonb'},
};

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('journal_entries', {
    payload: 'payload',
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn('journal_entries', 'payload');
}
