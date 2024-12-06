import { Column } from './time-slot.type';

export const columns: readonly Column[] = [
    {
        id: 'startTime',
        label: 'Start Time',
        minWidth: 170,
        align: 'left',
    },
    {
        id: 'endTime',
        label: 'End Time',
        minWidth: 170,
        align: 'left',
    },
    {
        id: 'examinationPackageName',
        label: 'Examination Package',
        minWidth: 170,
        align: 'left',
    },
    {
        id: 'period',
        label: 'Period',
        minWidth: 170,
        align: 'left',
    },
];
