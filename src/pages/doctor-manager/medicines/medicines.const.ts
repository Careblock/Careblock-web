import { Column } from './medicines.type';

export const columns: readonly Column[] = [
    {
        id: 'name',
        label: 'Name',
        minWidth: 170,
        align: 'left',
    },
    {
        id: 'thumbnail',
        label: 'Thumbnail',
        minWidth: 170,
        align: 'left',
    },
];
