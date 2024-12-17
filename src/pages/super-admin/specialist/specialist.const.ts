import { Column } from './specialist.type';

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
    {
        id: 'organizationName',
        label: 'Organization',
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
