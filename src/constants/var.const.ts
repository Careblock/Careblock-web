import { createTheme } from '@mui/material';

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor: any) => augmentColor({ color: { main: mainColor } });

export const AppConfig = {
    header_height: 64,
    footer_height: 56,
};

export const theme = createTheme({
    palette: {
        orange: createColor('#ff9d0a'),
        purple: createColor('#f122ff'),
    },
});
