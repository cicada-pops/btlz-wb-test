import { config } from 'dotenv';
import knex from 'knex';
import { GoogleSheetConfig } from '../types/google.js';

// Загружаем переменные окружения
config();

// Проверяем аргументы командной строки
if (process.argv.length < 4) {
    console.error('Использование: npm run add-sheet <sheet_id> <name> [tab_name]');
    process.exit(1);
}

const sheetId = process.argv[2];
const name = process.argv[3];
const tabName = process.argv[4] || 'stocks_coefs';

// Инициализируем подключение к БД
const db = knex({
    client: 'pg',
    connection: {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: Number(process.env.POSTGRES_PORT) || 5432,
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD
    }
});

async function addGoogleSheet(): Promise<void> {
    try {
        const sheet: GoogleSheetConfig = {
            sheet_id: sheetId,
            name: name,
            tab_name: tabName,
            is_active: true
        };

        await db('google_sheets').insert(sheet);
        console.log('Google таблица успешно добавлена');
    } catch (error) {
        console.error('Ошибка при добавлении Google таблицы:', error);
    } finally {
        await db.destroy();
    }
}

addGoogleSheet().catch(console.error); 