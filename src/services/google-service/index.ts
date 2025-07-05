import { google } from 'googleapis';
import { GoogleSheetConfig, GoogleSheetData } from '../../types/google.js';

export class GoogleSheetsService {
    private readonly auth;
    private readonly sheets;

    constructor(credentials: any, token: any) {
        this.auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
        this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    }

    async updateSheet(config: GoogleSheetConfig, data: GoogleSheetData[]): Promise<void> {
        try {
            const values = data.map(row => [
                row.date,
                row.warehouse,
                row.deliveryType,
                row.coefficient
            ]);

            values.unshift(['Дата', 'Склад', 'Тип доставки', 'Коэффициент']);

            await this.sheets.spreadsheets.values.clear({
                spreadsheetId: config.sheet_id,
                range: `${config.tab_name}!A1:Z`
            });

            await this.sheets.spreadsheets.values.update({
                spreadsheetId: config.sheet_id,
                range: `${config.tab_name}!A1`,
                valueInputOption: 'RAW',
                requestBody: {
                    values
                }
            });

            await this.sheets.spreadsheets.batchUpdate({
                spreadsheetId: config.sheet_id,
                requestBody: {
                    requests: [{
                        sortRange: {
                            range: {
                                sheetId: 0,
                                startRowIndex: 1,
                                startColumnIndex: 0,
                                endColumnIndex: 4
                            },
                            sortSpecs: [{
                                dimensionIndex: 3,
                                sortOrder: 'ASCENDING'
                            }]
                        }
                    }]
                }
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to update Google Sheet: ${error.message}`);
            }
            throw error;
        }
    }
} 