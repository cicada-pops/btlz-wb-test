import { config } from 'dotenv';
import knex from 'knex';

config();

const DEFAULT_SHEET_ID = '1nmbKLH7nF2LPxPR_iMbfwE6ObJy9B0r9plQ1IVhC1gU';
const DEFAULT_SHEET_NAME = 'Тарифы WB';
const DEFAULT_TAB_NAME = 'stocks_coefs';

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: Number(process.env.POSTGRES_PORT) || 5432,
        database: process.env.POSTGRES_DB || 'postgres',
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres'
    }
});

async function addDefaultSheet(): Promise<void> {
    try {
        const existingSheet = await db('google_sheets')
            .where('sheet_id', DEFAULT_SHEET_ID)
            .first();

        if (!existingSheet) {
            await db('google_sheets').insert({
                sheet_id: DEFAULT_SHEET_ID,
                name: DEFAULT_SHEET_NAME,
                tab_name: DEFAULT_TAB_NAME,
                is_active: true
            });
            console.log('Google таблица по умолчанию успешно добавлена');
        } else {
            console.log('Google таблица по умолчанию уже существует');
        }
    } catch (error) {
        console.error('Ошибка при добавлении Google таблицы по умолчанию:', error);
    } finally {
        await db.destroy();
    }
}

addDefaultSheet(); 