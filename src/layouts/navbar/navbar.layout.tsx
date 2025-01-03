import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '@/enums/RoutePath';
import { Images } from '@/assets/images';
import { ScrollToTop } from '@/components/base/scroll-to-top/scroll-top.component';
import { Badge, Dialog, DialogTitle, Fab, List, ListItem, Menu, Popover, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Login } from '@/pages/authentication/login/login.page';
import { useAuth } from '@/contexts/auth.context';
import { AuthContextType, User } from '@/types/auth.type';
import { ROLE_NAMES } from '@/enums/Common';
import avatarDefault from '@/assets/images/auth/avatarDefault.png';
import { Notifications } from '@/types/notification.type';
import * as signalR from '@microsoft/signalr';
import { Environment } from '@/environment';
import { useDispatch } from 'react-redux';
import { connect } from '@/stores/notification/notification.action';
import useObservable from '@/hooks/use-observable.hook';
import NotificationService from '@/services/notification.service';
import AccountService from '@/services/account.service';
import NotificationItem from '@/components/base/notification/notification.component';
import Nodata from '@/components/base/no-data/nodata.component';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: 'blur(24px)',
    border: '1px solid',
    borderColor: ((theme as any).vars || theme).palette.divider,
    backgroundColor: (theme as any).vars
        ? `rgba(${(theme as any).vars.palette.background.defaultChannel} / 0.4)`
        : alpha(theme.palette.background.default, 0.4),
    boxShadow: ((theme as any).vars || theme).shadows[1],
    padding: '8px 12px',
}));

export default function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subscribeOnce } = useObservable();
    const { userData } = useAuth() as AuthContextType;
    const [userInfo, setUserInfo] = useState<any>();
    const [notificationNumber, SetNotificationNumber] = useState(0);
    const [anchorElNoti, setAnchorElNoti] = useState<HTMLButtonElement | null>(null);
    const [notifications, setNotifications] = useState<Notifications[]>([]);
    const [openLoginForm, setOpenLoginForm] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);

    useEffect(() => {
        const connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${Environment.BASE_API}/notificationHub?userID=${userData?.id}`)
            .configureLogging(signalR.LogLevel.Error)
            .build();

        dispatch(connect(connection) as any);

        getUserInfor();
        getNotificationDatas();
        connectHub(connection);
    }, [userData]);

    const connectHub = (connection: any) => {
        connection.on('ReceiveNotification', () => {
            getNotificationDatas();
        });
        connection.start();
    };

    const fullName = `${userInfo?.firstname} ${userInfo?.lastname}`;
    const email = userInfo?.email;

    const getUserInfor = () => {
        if (!userData?.id) return;
        subscribeOnce(AccountService.getById(userData.id), (res: User) => {
            if (res) {
                setUserInfo(res);
            }
        });
    };

    const getNotificationDatas = () => {
        if (!userData?.id) return;
        subscribeOnce(NotificationService.getByUserId(userData.id), (res: Notifications[]) => {
            if (res) {
                setNotifications(res);
                SetNotificationNumber(res.filter((noti: Notifications) => !noti.isRead).length);
            }
        });
    };

    const handleMoveToPage = (event: any, pathname: string) => {
        event.stopPropagation();

        navigate({
            pathname: pathname,
        });
    };

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleLogout = () => {
        setAnchorEl(null);

        navigate({
            pathname: PATHS.LOGOUT,
        });
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorElNoti);
    const id = open ? 'noti-popover' : undefined;

    const handleClickNoti = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElNoti(event.currentTarget);
    };

    const handleCloseNoti = () => {
        setAnchorElNoti(null);
    };

    const handleClickRead = (noti: Notifications) => {
        if (!noti.isRead && noti?.id) {
            subscribeOnce(NotificationService.updateIsRead(noti.id), (res: Notifications) => {
                if (res) {
                    getNotificationDatas();
                }
            });
        }
    };

    const menuId = 'primary-search-account-menu';

    const renderMenu = (
        <Menu
            keepMounted
            className="mt-[50px]"
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
            <MenuItem className="!p-0 min-w-[180px]">
                <div className="flex flex-col w-full text-[#212121]">
                    <div className="flex flex-col items-center justify-center pt-1 mb-2 px-[12px]">
                        <img
                            className="w-10 h-10 object-cover rounded-full mb-2"
                            alt="avatar"
                            src={userInfo?.avatar ? userInfo?.avatar : avatarDefault}
                        />
                        <div className="text-center">
                            <Typography className="!text-[16px] leading-[16px] !font-bold">{fullName}</Typography>
                        </div>
                        <div className="text-center">
                            <Typography className="!text-[14px] leading-[14px] text-[#333333]">{email}</Typography>
                        </div>
                    </div>
                    <div className="flex items-center" onClick={() => navigate('/user/info')}>
                        <Images.FaUser size={18} className="ml-5" />
                        <Typography className="text-[14px] p-2 ml-8">My Account</Typography>
                    </div>
                    <div className="flex items-center">
                        <Images.MdOutlineHelp size={18} className="ml-5" />
                        <Typography className="text-[14px] p-2 ml-8">Help</Typography>
                    </div>
                    <div className="flex items-center border-t" onClick={() => handleLogout()}>
                        <Images.IoLogOutOutline size={18} color="red" className="ml-5" />
                        <Typography className="text-[14px] px-2 pb-2 pt-4 ml-8 text-[red]">Log Out</Typography>
                    </div>
                </div>
            </MenuItem>
        </Menu>
    );

    const handleClickOpen = () => {
        setOpenLoginForm(true);
    };

    const handleClose = () => {
        setOpenLoginForm(false);
    };

    const isUser = () => {
        return userData?.roles?.includes(ROLE_NAMES.PATIENT);
    };

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpenDrawer(newOpen);
    };

    const SimpleDialog = (_: any) => {
        return (
            <Dialog className="bg-blue-gray-300" open={openLoginForm} onClose={handleClose}>
                <DialogTitle></DialogTitle>
                <List style={{ width: '500px', height: '300px' }} className="rounded-xl">
                    <ListItem>
                        <Login handleClose={handleClose} />
                    </ListItem>
                </List>
            </Dialog>
        );
    };

    return (
        <>
            <Toolbar id="back-to-top-anchor" className="!h-[52px] !min-h-[52px]" />
            <AppBar
                position="fixed"
                enableColorOnDark
                sx={{
                    boxShadow: 0,
                    bgcolor: 'transparent',
                    backgroundImage: 'none',
                    mt: 'calc(var(--template-frame-height, 0px) + 28px)',
                }}
            >
                <Container maxWidth="lg">
                    <StyledToolbar variant="dense" disableGutters>
                        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
                            <div
                                className="header__brand cursor-pointer flex items-center"
                                onClick={($event) => handleMoveToPage($event, PATHS.HOME)}
                            >
                                <img
                                    alt="Selected Avatar"
                                    className="w-10 h-10 object-cover rounded-full mr-[10px] select-none"
                                    src={Images.Logo}
                                />
                                <div className="header-brand__text select-none font-semibold text-[14px] uppercase text-primary">
                                    Careblock
                                </div>
                                {isUser() && (
                                    <div className="ml-[14px] border-l-[2px]">
                                        <div
                                            className="ml-[4px] select-none text-[14px] text-primary hover:text-white hover:bg-primary px-[10px] py-[6px] rounded"
                                            onClick={($event) =>
                                                handleMoveToPage($event, PATHS.PATIENT_APPOINTMENT_HISTORY)
                                            }
                                        >
                                            Histories
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Box>
                        {isUser() ? (
                            <div className="mr-[4px]">
                                <IconButton
                                    size="medium"
                                    aria-label="show 4 new mails"
                                    color="inherit"
                                    className="!p-[8px]"
                                    aria-describedby={id}
                                    onClick={handleClickNoti}
                                >
                                    <Badge badgeContent={notificationNumber} color="error">
                                        <Images.MdOutlineNotifications size={26} color="#1976d2" />
                                    </Badge>
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    size="medium"
                                    color="inherit"
                                    className="!p-[8px]"
                                    aria-haspopup="true"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    onClick={handleProfileMenuOpen}
                                >
                                    <img
                                        src={userInfo?.avatar ? userInfo?.avatar : avatarDefault}
                                        alt="avatar"
                                        className="w-10 h-10 object-cover rounded-[175px]"
                                    />
                                </IconButton>
                            </div>
                        ) : (
                            <Box
                                sx={{
                                    display: { xs: 'none', md: 'flex' },
                                    gap: 1,
                                    alignItems: 'center',
                                }}
                            >
                                <Button
                                    className="!text-[12px]"
                                    color="primary"
                                    variant="text"
                                    size="small"
                                    onClick={handleClickOpen}
                                >
                                    Sign in
                                </Button>
                                <Button className="!text-[12px]" color="primary" variant="contained" size="small">
                                    <Link to="https://eternl.io/app/mainnet/welcome" target="_blank">
                                        Sign up
                                    </Link>
                                </Button>
                            </Box>
                        )}
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
                            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                                <MenuIcon />
                            </IconButton>
                            <Drawer
                                anchor="top"
                                open={openDrawer}
                                onClose={toggleDrawer(false)}
                                PaperProps={{
                                    sx: {
                                        top: 'var(--template-frame-height, 0px)',
                                    },
                                }}
                            >
                                <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                        }}
                                    >
                                        <IconButton onClick={toggleDrawer(false)}>
                                            <CloseRoundedIcon />
                                        </IconButton>
                                    </Box>

                                    <Divider sx={{ my: 3 }} />
                                    <MenuItem>
                                        <Button color="primary" variant="contained" fullWidth onClick={handleClickOpen}>
                                            Sign up
                                        </Button>
                                    </MenuItem>
                                    <MenuItem>
                                        <Button color="primary" variant="outlined" fullWidth>
                                            <Link to="https://eternl.io/app/mainnet/welcome" target="_blank">
                                                Sign in
                                            </Link>
                                        </Button>
                                    </MenuItem>
                                </Box>
                            </Drawer>
                        </Box>
                    </StyledToolbar>
                </Container>
            </AppBar>
            {renderMenu}
            <ScrollToTop>
                <Fab size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollToTop>
            {/* Login popup */}
            <SimpleDialog open={openLoginForm} onClose={handleClose} />
            {/* Notification popup */}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorElNoti}
                onClose={handleCloseNoti}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <div className="py-[14px] pl-[16px] w-[340px]">
                    <div className="font-bold mb-[10px] text-[18px] select-none mr-[16px] text-[#212121]">
                        Notifications
                    </div>
                    <div className="space-y-[6px] max-h-[600px] overflow-auto">
                        {notifications?.length > 0 ? (
                            notifications.map((noti: Notifications, index: number) => (
                                <div className="mr-[16px]" key={index}>
                                    <NotificationItem
                                        type={noti.notificationTypeId}
                                        message={noti.message}
                                        isRead={noti.isRead}
                                        link={noti.link}
                                        onClickAccept={() => {}}
                                        onClickDecline={() => {}}
                                        onClickRead={() => handleClickRead(noti)}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="w-[200px] mx-auto">
                                <Nodata />
                            </div>
                        )}
                    </div>
                </div>
            </Popover>
        </>
    );
}
