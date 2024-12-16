export interface Column {
    id: 'examinationPackageName' | 'startTime' | 'endTime' | 'period';
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: number) => string;
}
