import { Column } from './invite-members.type';

export const columns: readonly Column[] = [
    {
        id: 'firstname',
        label: 'Name',
        minWidth: 180,
        align: 'left',
    },
    {
        id: 'avatar',
        label: 'Avatar',
        minWidth: 100,
        align: 'left',
    },
    {
        id: 'email',
        label: 'Email',
        minWidth: 170,
        align: 'left',
    },
    {
        id: 'roles',
        label: 'Roles',
        minWidth: 100,
        align: 'center',
    },
];
