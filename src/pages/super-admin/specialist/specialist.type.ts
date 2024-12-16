export interface Column {
    id: 'name' | 'thumbnail' | 'description' | 'organizationName';
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: number) => string;
}