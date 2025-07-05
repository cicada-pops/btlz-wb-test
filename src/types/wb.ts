export interface WBWarehouse {
    warehouseName: string;
    boxDeliveryAndStorageExpr: string;
    boxDeliveryBase: string;
    boxDeliveryLiter: string;
    boxStorageBase: string;
    boxStorageLiter: string;
}

export interface WBApiResponse {
    response: {
        data: {
            dtNextBox: string;
            dtTillMax: string;
            warehouseList: WBWarehouse[];
        };
    };
}

export interface TariffRecord {
    id?: number;
    date: Date;
    warehouse_id: string;
    delivery_base: number;
    delivery_liter: number;
    storage_base: number;
    storage_liter: number;
    raw_data: Record<string, any>;
    created_at?: Date;
    updated_at?: Date;
} 