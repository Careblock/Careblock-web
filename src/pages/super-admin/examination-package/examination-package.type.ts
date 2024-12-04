export interface Column {
    id: 'name' | 'thumbnail' | 'organizationName' | 'examinationTypeName';
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: number) => string;
}
