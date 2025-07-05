import { Knex } from 'knex';
import { TariffRecord } from '../../types/wb.js';
import { GoogleSheetConfig } from '../../types/google.js';

export class DBService {
    constructor(private readonly knex: Knex) {}

    async saveTariffs(tariffs: TariffRecord[]): Promise<void> {
        const date = new Date();
        
        await this.knex.transaction(async (trx) => {
            await trx('tariffs')
                .where('date', date)
                .delete();

            await trx('tariffs')
                .insert(tariffs.map(t => ({
                    ...t,
                    date
                })));
        });
    }

    async getTariffsByDate(date: Date): Promise<TariffRecord[]> {
        return this.knex
            .select('*')
            .from(
                this.knex('tariffs')
                    .select('*')
                    .where('date', date)
                    .as('t')
            )
            .orderBy('storage_base', 'asc')
            .orderBy('storage_liter', 'asc');
    }

    async getActiveGoogleSheets(): Promise<GoogleSheetConfig[]> {
        return this.knex('google_sheets')
            .where('is_active', true)
            .orderBy('created_at', 'asc');
    }

    async addGoogleSheet(config: GoogleSheetConfig): Promise<number> {
        const [id] = await this.knex('google_sheets')
            .insert(config)
            .returning('id');
        return id;
    }

    async updateGoogleSheetSync(id: number): Promise<void> {
        await this.knex('google_sheets')
            .where('id', id)
            .update({
                last_sync: new Date(),
                updated_at: new Date()
            });
    }

    async removeGoogleSheet(id: number): Promise<void> {
        await this.knex('google_sheets')
            .where('id', id)
            .delete();
    }
} 