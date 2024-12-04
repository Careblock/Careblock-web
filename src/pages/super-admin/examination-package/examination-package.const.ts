import { Column } from './examination-package.type';

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
        id: 'examinationTypeName',
        label: 'Examination Type',
        minWidth: 170,
        align: 'left',
    },
    {
        id: 'organizationName',
        label: 'Organization',
        minWidth: 170,
        align: 'left',
    },
];
