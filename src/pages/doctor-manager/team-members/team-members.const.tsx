import { Theme } from '@mui/material';

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
