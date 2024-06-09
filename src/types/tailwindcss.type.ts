import { PaletteColorOptions } from '@mui/material';

declare module '@mui/material/styles' {
    interface CustomPalette {
        orange: PaletteColorOptions;
        purple: PaletteColorOptions;
    }
    interface Palette extends CustomPalette {}
    interface PaletteOptions extends CustomPalette {}
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        orange: true;
        purple: true;
    }
}
