export interface Column {
    id: 'name' | 'specialistName' | 'description' | 'price' | 'timeEstimation';
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: number) => string;
}
