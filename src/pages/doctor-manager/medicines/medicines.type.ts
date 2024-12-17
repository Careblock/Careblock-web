export interface Column {
    id: 'name' | 'thumbnail';
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: number) => string;
}
