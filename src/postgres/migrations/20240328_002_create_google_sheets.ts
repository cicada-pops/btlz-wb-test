import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('google_sheets', (table) => {
        table.increments('id').primary();
        table.string('sheet_id').notNullable();
        table.string('name').notNullable();
        table.string('tab_name').notNullable().defaultTo('stocks_coefs'); // По умолчанию используем лист stocks_coefs
        table.boolean('is_active').notNullable().defaultTo(true);
        table.timestamp('last_sync').nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        
        // Уникальный индекс для sheet_id
        table.unique(['sheet_id']);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('google_sheets');
} 