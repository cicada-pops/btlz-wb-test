export interface GoogleSheetConfig {
    id?: number;
    sheet_id: string;
    name: string;
    tab_name: string;
    is_active: boolean;
    last_sync?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface GoogleSheetData {
    date: string;
    warehouse: string;
    deliveryType: string;
    coefficient: number;
} 