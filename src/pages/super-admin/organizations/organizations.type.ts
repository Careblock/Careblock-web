export interface Column {
    id: 'code' | 'name' | 'city' | 'district' | 'address' | 'mapUrl' | 'thumbnail' | 'tel' | 'website' | 'fax';
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: number) => string;
}
