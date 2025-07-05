import { Knex } from 'knex';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Загружаем переменные окружения
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const knexConfig: Knex.Config = {
    client: 'pg',
    connection: {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: Number(process.env.POSTGRES_PORT) || 5432,
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD
    },
    migrations: {
        directory: join(__dirname, '../../postgres/migrations'),
        tableName: 'knex_migrations'
    },
    pool: {
        min: 2,
        max: 10
    }
};

export default knexConfig;
