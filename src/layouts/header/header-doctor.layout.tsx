import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Fab, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import avatarDefault from '@/assets/images/auth/avatarDefault.png';
import useObservable from '@/hooks/use-observable.hook';
import AccountService from '@/services/account.service';
import { AuthContextType, User } from '@/types/auth.type';
import { useAuth } from '@/contexts/auth.context';
import { PATHS } from '@/enums/RoutePath';
import { Images } from '@/assets/images';
import { ScrollToTop } from '@/components/base/scroll-to-top/scroll-top.component';

const HeaderDoctor = () => {
    const navigate = useNavigate();
    const { subscribeOnce } = useObservable();
    const { userData } = useAuth() as AuthContextType;
    const [userInfo, setUserInfo] = useState<any>();

    useEffect(() => {
        subscribeOnce(AccountService.getById(userData?.id), (res: User) => {
            if (res) {
                setUserInfo(res);
            }
        });
    }, []);

    const fullName = `${userInfo?.firstname} ${userInfo?.lastname}`;
    const email = userInfo?.email;

    const handleMoveToPage = (pathname: string) => {
        navigate({
            pathname: pathname,
        });
    };

    const handleLogout = () => {
        navigate({
            pathname: PATHS.LOGOUT,
        });
    };

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';

    const renderMenu = (
        <Menu
            keepMounted
            className="mt-15"
            id={menuId}
            open={isMenuOpen}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            onClose={handleMenuClose}
        >
            <MenuItem className="!p-0 w-[160px]">
                <div className="flex flex-col w-full">
                    <div className="flex flex-col items-center justify-center pt-1 mb-1">
                        <img
                            alt="avatar"
                            aria-hidden="true"
                            className="w-10 h-10 object-cover rounded-full mb-2"
                            src={userInfo?.avatar ? userInfo?.avatar : avatarDefault}
                        />
                        <div className="flex flex-col justify-center items-center">
                            <Typography className="text-xl !font-bold">{fullName}</Typography>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <Typography className="text-xl !font-bold">{email}</Typography>
                        </div>
                    </div>
                    <div className="flex items-center  hover:bg-gray" onClick={() => navigate('/patient/detail_info')}>
                        <Images.FaUser size={18} className="ml-5" />
                        <Typography className="text-lg p-3 ml-8">My Account</Typography>
                    </div>
                    <div className="flex items-center  hover:bg-gray ">
                        <Images.IoMdHelp size={18} className="ml-5" />
                        <Typography className="text-lg p-3 ml-8">Help</Typography>
                    </div>
                    <div className="flex items-center hover:bg-gray " onClick={() => handleLogout()}>
                        <Images.IoLogOutOutline size={18} color="red" className="ml-5" />
                        <Typography className="text-lg p-3 ml-8 text-red">Log Out</Typography>
                    </div>
                </div>
            </MenuItem>
        </Menu>
    );

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
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <Images.MdOutlineNotifications size={26} />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                    <Badge badgeContent={17} color="error">
                        <Images.PiChatsBold size={26} />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    {userInfo?.avatar ? (
                        <img
                            src={userInfo?.avatar}
                            alt="Selected Avatar"
                            className="w-8 h-8 object-cover rounded-[175px] mr-2"
                            aria-hidden="true"
                        />
                    ) : (
                        <img
                            src={avatarDefault}
                            alt="Selected Avatar"
                            className="w-8 h-8 object-cover rounded-[175px] mr-2"
                            aria-hidden="true"
                        />
                    )}
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed">
                    <Toolbar className="w-full text-white flex justify-between items-center !h-[52px] !min-h-[52px] bg-primary">
                        <div
                            className="header__brand cursor-pointer flex items-center"
                            onClick={() => handleMoveToPage(PATHS.HOME)}
                        >
                            <img
                                src={Images.Logo}
                                alt="Selected Avatar"
                                className="w-10 h-10 object-cover rounded-full mr-3"
                                aria-hidden="true"
                            />
                            <div className="header-brand__text select-none font-bold text-xl uppercase  text-white">
                                Careblock
                            </div>
                        </div>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }} className="gap-x-2">
                            <IconButton size="medium" aria-label="show 4 new mails" color="inherit">
                                <Badge badgeContent={4} color="error">
                                    <Images.MdOutlineNotifications size={26} />
                                </Badge>
                            </IconButton>
                            <IconButton size="medium" aria-label="show 17 new notifications" color="inherit">
                                <Badge badgeContent={17} color="error">
                                    <Images.PiChatsBold size={26} />
                                </Badge>
                            </IconButton>
                            <IconButton
                                size="medium"
                                color="inherit"
                                onClick={() => handleMoveToPage(PATHS.DOCTOR_SCHEDULE)}
                            >
                                <Images.CalendarMonthIcon className="text-[26px]" />
                            </IconButton>
                            <IconButton
                                edge="end"
                                size="medium"
                                color="inherit"
                                className="ml-8"
                                aria-haspopup="true"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                onClick={handleProfileMenuOpen}
                            >
                                <img
                                    src={userInfo?.avatar ? userInfo?.avatar : avatarDefault}
                                    alt="avatar"
                                    className="w-10 h-10 object-cover rounded-[175px]"
                                    aria-hidden="true"
                                />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="medium"
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <Images.RiMenu3Line size={22} />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                {renderMobileMenu}
                {renderMenu}
                <Toolbar id="back-to-top-anchor" className="!h-[52px] !min-h-[52px]" />
            </Box>
            <ScrollToTop>
                <Fab size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollToTop>
        </>
    );
};

export default HeaderDoctor;
