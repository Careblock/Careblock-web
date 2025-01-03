import { useScrollTrigger } from '@mui/material';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import { Props } from '@/layouts/navbar/navbar.type';

export function ScrollToTop(props: Props) {
    const { children, window } = props;

    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const anchor = ((event.target as HTMLDivElement).ownerDocument || document).querySelector(
            '#back-to-top-anchor'
        );

        if (anchor) {
            anchor.scrollIntoView({
                block: 'center',
            });
        }
    };

    return (
        <Fade in={trigger}>
            <Box
                role="presentation"
                sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 99 }}
                onClick={handleClick}
            >
                {children}
            </Box>
        </Fade>
    );
}
