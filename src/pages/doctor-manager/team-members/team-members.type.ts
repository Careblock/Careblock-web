export interface Column {
    id: 'firstname' | 'avatar' | 'email' | 'roles';
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: number) => string;
}
