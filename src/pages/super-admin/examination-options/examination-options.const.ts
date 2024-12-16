import { Column } from './examination-options.type';

export const columns: readonly Column[] = [
    {
        id: 'name',
        label: 'Name',
        minWidth: 170,
        align: 'left',
    },
    {
        id: 'specialistName',
        label: 'Specialist',
        minWidth: 170,
        align: 'left',
    },
    {
        id: 'price',
        label: 'Price',
        minWidth: 170,
        align: 'left',
    },
    {
        id: 'timeEstimation',
        label: 'Time Estimation',
        minWidth: 170,
        align: 'left',
    },
    {
        id: 'description',
        label: 'Description',
        minWidth: 170,
        align: 'left',
    },
];
