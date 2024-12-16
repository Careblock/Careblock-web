import { Button, Dialog, DialogTitle, List, ListItem } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fab from '@mui/material/Fab';
import { Link, useNavigate } from 'react-router-dom';
import * as React from 'react';
import { Login } from '@/pages/authentication/login/login.page';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box';
import { PATHS } from '@/enums/RoutePath';
import { Images } from '@/assets/images';
import { ScrollToTop } from '@/components/base/scroll-to-top/scroll-top.component';

export default function PrimarySearchAppBar() {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleMoveToPage = (pathname: string) => {
        navigate({
            pathname: pathname,
        });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function SimpleDialog(_: any) {
        return (
            <Dialog className="bg-blue-gray-300" open={open} onClose={handleClose}>
                <DialogTitle></DialogTitle>
                <List style={{ width: '500px', height: '300px' }} className="rounded-xl">
                    <ListItem>
                        <Login handleClose={handleClose} />
                    </ListItem>
                </List>
            </Dialog>
        );
    }

    const mobileMenuId = 'primary-search-account-menu-mobile';

    const renderMobileMenu = (
        <Menu
            keepMounted
            className="mt-10"
            id={mobileMenuId}
            open={isMobileMenuOpen}
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <p className="py-2 px-4" onClick={handleClickOpen}>
                    LOGIN
                </p>
            </MenuItem>
            <MenuItem>
                <a href="https://eternl.io/app/mainnet/welcome" target="_blank" rel="noreferrer" className="py-2 px-4">
                    REGISTER
                </a>
            </MenuItem>
        </Menu>
    );

    return (
        <>
            <Box>
                <AppBar position="fixed">
                    <Toolbar className="select-none w-full !h-[52px] !min-h-[52px] text-white flex items-center justify-between bg-primary">
                        <div
                            className="header__brand cursor-pointer flex items-center"
                            onClick={() => handleMoveToPage(PATHS.HOME)}
                        >
                            <img
                                alt="Selected Avatar"
                                className="w-10 h-10 object-cover rounded-[175px] mr-3"
                                src={Images.Logo}
                            />
                            <div className="header-brand__text select-none font-bold text-xl uppercase">Careblock</div>
                        </div>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <div className="flex items-center justify-center gap-5">
                                <Button variant="contained" color="orange" onClick={handleClickOpen}>
                                    Login
                                </Button>
                                <Link to="https://eternl.io/app/mainnet/welcome" target="_blank">
                                    <Button variant="contained" color="purple">
                                        Register
                                    </Button>
                                </Link>
                            </div>
                        </Box>
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                color="inherit"
                                aria-haspopup="true"
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                onClick={handleMobileMenuOpen}
                            >
                                <Images.RiMenu3Line size={22} />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                {renderMobileMenu}
                <SimpleDialog open={open} onClose={handleClose} />
                <Toolbar id="back-to-top-anchor" className="!h-[52px] !min-h-[52px]" />
            </Box>
            <ScrollToTop>
                <Fab size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollToTop>
        </>
    );
}
