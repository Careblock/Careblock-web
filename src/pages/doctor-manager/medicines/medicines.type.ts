export interface Column {
    id: 'name' | 'thumbnail' | 'medicineTypeName' | 'price' | 'unitPriceName' | 'description';
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: number) => string;
}
