export interface Column {
    id: 'name' | 'location' | 'organizationName';
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: number) => string;
}
