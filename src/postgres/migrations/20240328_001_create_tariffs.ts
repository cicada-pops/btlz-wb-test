import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('tariffs', (table) => {
        table.increments('id').primary();
        table.date('date').notNullable();
        table.string('warehouse_id').notNullable();
        table.decimal('delivery_base', 10, 2).notNullable();
        table.decimal('delivery_liter', 10, 2).notNullable();
        table.decimal('storage_base', 10, 2).notNullable();
        table.decimal('storage_liter', 10, 2).notNullable();
        table.jsonb('raw_data').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        
        // Индексы для быстрого поиска
        table.index(['date', 'warehouse_id']);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('tariffs');
} 