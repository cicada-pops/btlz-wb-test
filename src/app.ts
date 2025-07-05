import { config } from 'dotenv';
import { schedule } from 'node-cron';
import knex from 'knex';
import { WBService } from './services/wb-service/index.js';
import { GoogleSheetsService } from './services/google-service/index.js';
import { DBService } from './services/db-service/index.js';
import { TariffRecord } from './types/wb.js';
import { GoogleSheetData } from './types/google.js';

config();

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

const wbService = new WBService();
const googleService = new GoogleSheetsService(
    JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}'),
    JSON.parse(process.env.GOOGLE_TOKEN || '{}')
);
const dbService = new DBService(db);

async function updateTariffs(): Promise<void> {
    try {
        const tariffs = await wbService.getTariffs();
        
        await dbService.saveTariffs(tariffs);

        console.log('Тарифы успешно обновлены');
    } catch (error) {
        console.error('Ошибка при обновлении тарифов:', error);
    }
}

async function updateGoogleSheets(): Promise<void> {
    try {
        const sheets = await dbService.getActiveGoogleSheets();
        
        const tariffs = await dbService.getTariffsByDate(new Date());

        const sheetData: GoogleSheetData[] = tariffs.map(t => ({
            date: t.date.toISOString().split('T')[0],
            warehouse: t.warehouse_id,
            deliveryType: `${t.delivery_base} / ${t.delivery_liter}`,
            coefficient: Number(t.storage_base) + Number(t.storage_liter)
        }));

        for (const sheet of sheets) {
            try {
                await googleService.updateSheet(sheet, sheetData);
                await dbService.updateGoogleSheetSync(sheet.id!);
                console.log(`Таблица ${sheet.name} успешно обновлена`);
            } catch (error) {
                console.error(`Ошибка при обновлении таблицы ${sheet.name}:`, error);
            }
        }
    } catch (error) {
        console.error('Ошибка при обновлении Google таблиц:', error);
    }
}

schedule('0 * * * *', updateTariffs);
schedule('*/15 * * * *', updateGoogleSheets);

updateTariffs().catch(console.error);

console.log('Сервис запущен');

process.on('SIGTERM', async () => {
    console.log('Завершение работы...');
    await db.destroy();
    process.exit(0);
});