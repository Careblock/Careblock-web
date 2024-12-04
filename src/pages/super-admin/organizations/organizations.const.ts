import { Column } from './organizations.type';

export const columns: readonly Column[] = [
    {
        id: 'code',
        label: 'Code',
        minWidth: 100,
        align: 'left',
    },
    {
        id: 'name',
        label: 'Name',
        minWidth: 180,
        align: 'left',
    },
    {
        id: 'thumbnail',
        label: 'Thumbnail',
        minWidth: 160,
        align: 'left',
    },
    {
        id: 'city',
        label: 'City',
        minWidth: 150,
        align: 'left',
    },
    {
        id: 'district',
        label: 'District',
        minWidth: 160,
        align: 'left',
    },
    {
        id: 'address',
        label: 'Address',
        minWidth: 200,
        align: 'left',
    },
    {
        id: 'mapUrl',
        label: 'MapUrl',
        minWidth: 160,
        align: 'left',
    },
    {
        id: 'tel',
        label: 'Tel',
        minWidth: 150,
        align: 'left',
    },
    {
        id: 'website',
        label: 'Website',
        minWidth: 150,
        align: 'left',
    },
    {
        id: 'fax',
        label: 'Fax',
        minWidth: 150,
        align: 'left',
    },
];
