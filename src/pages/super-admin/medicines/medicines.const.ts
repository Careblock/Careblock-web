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
    {
        id: 'medicineTypeName',
        label: 'Medicine Type',
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
        id: 'unitPriceName',
        label: 'Unit Price',
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
