import axios from 'axios';
import { WBApiResponse, TariffRecord } from '../../types/wb.js';

export class WBService {
    private readonly apiUrl = 'https://common-api.wildberries.ru/api/v1/tariffs/box';
    private readonly apiKey: string;

    constructor() {
        const apiKey = process.env.WB_API_KEY;
        if (!apiKey) {
            throw new Error('WB_API_KEY is not set in environment variables');
        }
        this.apiKey = apiKey;
    }

    async getTariffs(): Promise<TariffRecord[]> {
        try {
            const today = new Date().toISOString().split('T')[0];

            const response = await axios.get<WBApiResponse>(this.apiUrl, {
                headers: {
                    'Authorization': this.apiKey
                },
                params: {
                    date: today
                }
            });
            
            return response.data.response.data.warehouseList.map(warehouse => ({
                date: new Date(),
                warehouse_id: warehouse.warehouseName,
                delivery_base: parseFloat(warehouse.boxDeliveryBase.replace(',', '.')),
                delivery_liter: parseFloat(warehouse.boxDeliveryLiter.replace(',', '.')),
                storage_base: warehouse.boxStorageBase === '-' ? 0 : parseFloat(warehouse.boxStorageBase.replace(',', '.')),
                storage_liter: warehouse.boxStorageLiter === '-' ? 0 : parseFloat(warehouse.boxStorageLiter.replace(',', '.')),
                raw_data: warehouse
            }));
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Неверный API ключ WB или ошибка авторизации');
                } else if (error.response?.status === 429) {
                    throw new Error('Превышен лимит запросов к API WB (максимум 60 запросов в минуту)');
                } else if (error.response?.status === 400) {
                    throw new Error(`Ошибка в запросе: ${error.response.data.detail}`);
                }
                throw new Error(`Ошибка API WB: ${error.response?.data?.detail || error.message}`);
            }
            throw error;
        }
    }
} 