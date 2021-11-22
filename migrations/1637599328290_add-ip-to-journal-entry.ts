import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = {
  ip: {type: 'varchar(100)'},
};

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('journal_entries', {
    ip: 'ip',
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn('journal_entries', 'ip');
}
