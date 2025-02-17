import { Column } from './team-members.type';
import { Theme } from '@mui/material';

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
        fontWeight: personName.includes(name) ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular,
    };
}
