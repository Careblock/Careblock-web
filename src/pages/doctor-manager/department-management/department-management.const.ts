import { Column } from './department-management.type';

export const columns: readonly Column[] = [
    {
        id: 'name',
        label: 'Name',
        minWidth: 170,
        align: 'left',
    },
    {
        id: 'location',
        label: 'Location',
        minWidth: 170,
        align: 'left',
    },
];
