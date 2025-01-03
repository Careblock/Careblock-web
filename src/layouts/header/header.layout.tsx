import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Fab, Popover, Select, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import avatarDefault from '@/assets/images/auth/avatarDefault.png';
import { AuthContextType, User } from '@/types/auth.type';
import { useAuth } from '@/contexts/auth.context';
import { PATHS } from '@/enums/RoutePath';
import { Images } from '@/assets/images';
import { ScrollToTop } from '@/components/base/scroll-to-top/scroll-top.component';
import AccountService from '@/services/account.service';
import useObservable from '@/hooks/use-observable.hook';
import { ROLE_NAMES } from '@/enums/Common';
import NotificationItem from '@/components/base/notification/notification.component';
import { Notifications } from '@/types/notification.type';
import NotificationService from '@/services/notification.service';
import PopupChooseDepartment from './popup-choose-department/popup-choose-department.component';
import { SystemMessage } from '@/constants/message.const';
import { addToast } from '@/components/base/toast/toast.service';
import DepartmentService from '@/services/department.service';
import { Departments } from '@/types/department.type';
import * as signalR from '@microsoft/signalr';
import { Environment } from '@/environment';
import { useDispatch } from 'react-redux';
import { connect } from '@/stores/notification/notification.action';
import Nodata from '@/components/base/no-data/nodata.component';
import { ToastPositionEnum, ToastStatusEnum } from '@/components/base/toast/toast.type';

const HeaderLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subscribeOnce } = useObservable();
    const { userData } = useAuth() as AuthContextType;
    const [userInfo, setUserInfo] = useState<any>();
    const [notificationNumber, SetNotificationNumber] = useState(0);
    const [anchorElNoti, setAnchorElNoti] = useState<HTMLButtonElement | null>(null);
    const [notification, setNotification] = useState<Notifications>();
    const [notifications, setNotifications] = useState<Notifications[]>([]);
    const [isVisiblePopupDepartment, setIsVisiblePopupDepartment] = useState<boolean>(false);
    const [departmentId, setDepartmentId] = useState<string>('');
    const [departments, setDepartments] = useState<Departments[]>([]);

    useEffect(() => {
        const connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${Environment.BASE_API}/notificationHub?userID=${userData?.id}`)
            .configureLogging(signalR.LogLevel.Error)
            .build();

        dispatch(connect(connection) as any);

        getUserInfor();
        getNotificationDatas();
        connectHub(connection);
    }, []);

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

    const open = Boolean(anchorElNoti);
    const id = open ? 'noti-popover' : undefined;

    const handleClickNoti = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElNoti(event.currentTarget);
    };

    const handleCloseNoti = () => {
        setAnchorElNoti(null);
    };

    const getDepartmentData = (orgId: string) => {
        if (!orgId) return;
        subscribeOnce(DepartmentService.getByOrganization(orgId), (res: any) => {
            if (res) setDepartments(res.map((data: any) => ({ name: data.name, departmentId: data.id })));
        });
    };

    const handleClickAccept = (noti: Notifications) => {
        setIsVisiblePopupDepartment(true);
        setNotification(noti);
        setTimeout(() => {
            getDepartmentData(noti.originId!);
        }, 500);
    };

    const handleClickDecline = (noti: Notifications) => {
        if (!noti?.id) return;
        subscribeOnce(NotificationService.decline(noti.id), (res: boolean) => {
            if (res) {
                getNotificationDatas();
            }
        });
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

    const handleClosePopupDepartment = () => {
        setIsVisiblePopupDepartment(false);
        setDepartmentId('');
    };

    const handleConfirmDepartment = () => {
        if (!userData?.id) return;
        subscribeOnce(
            AccountService.chooseDepartment(userData.id, {
                notificationId: notification?.id!,
                departmentId: departmentId,
            }),
            (res: boolean) => {
                if (res === true) {
                    setIsVisiblePopupDepartment(false);
                    getNotificationDatas();
                    addToast({
                        text: SystemMessage.JOIN_ORG,
                        position: ToastPositionEnum.TopRight,
                        status: ToastStatusEnum.Valid,
                    });
                } else {
                    setIsVisiblePopupDepartment(false);
                    addToast({
                        text: SystemMessage.JOIN_ORG_FAILED,
                        position: ToastPositionEnum.TopRight,
                        status: ToastStatusEnum.Warn,
                    });
                }
            }
        );
    };

    const handleChooseDepartment = (event: any) => {
        setDepartmentId(event.target.value ?? '');
    };

    const menuId = 'primary-search-account-menu';

    const renderMenu = (
        <Menu
            keepMounted
            className="mt-[32px]"
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
                    <Badge badgeContent={notificationNumber} color="error">
                        <Images.MdOutlineNotifications size={26} />
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
                        />
                    ) : (
                        <img
                            src={avatarDefault}
                            alt="Selected Avatar"
                            className="w-8 h-8 object-cover rounded-[175px] mr-2"
                        />
                    )}
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    return (
        <>
            <Box>
                <AppBar position="fixed">
                    <Toolbar className="w-full text-white flex justify-between items-center !h-[52px] !min-h-[52px] bg-primary">
                        <div
                            className="header__brand cursor-pointer flex items-center select-none"
                            onClick={() => handleMoveToPage(PATHS.HOME)}
                        >
                            <img
                                src={Images.Logo}
                                alt="Selected Avatar"
                                className="w-10 h-10 object-cover rounded-full mr-3"
                            />
                            <div className="header-brand__text select-none font-bold text-xl uppercase tracking-wider text-white">
                                Careblock
                            </div>
                        </div>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }} className="gap-x-2">
                            {userData?.roles?.includes(ROLE_NAMES.DOCTOR) && (
                                <IconButton
                                    size="medium"
                                    color="inherit"
                                    title="Scheduled"
                                    onClick={() => handleMoveToPage(PATHS.DOCTOR_SCHEDULE)}
                                >
                                    <Images.CalendarMonthIcon className="text-[26px]" />
                                </IconButton>
                            )}
                            {userData?.roles?.includes(ROLE_NAMES.MANAGER) && (
                                <IconButton
                                    size="medium"
                                    color="inherit"
                                    title="Manager"
                                    onClick={() => handleMoveToPage(PATHS.ORGANIZATION_INFOR)}
                                >
                                    <Images.IoSettings className="text-[26px]" />
                                </IconButton>
                            )}
                            <IconButton
                                size="medium"
                                aria-label="show 4 new mails"
                                color="inherit"
                                aria-describedby={id}
                                onClick={handleClickNoti}
                            >
                                <Badge badgeContent={notificationNumber} color="error">
                                    <Images.MdOutlineNotifications size={26} />
                                </Badge>
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
                    <div className="font-bold mb-[10px] text-[18px] select-none mr-[16px]">Notifications</div>
                    <div className="space-y-[6px] max-h-[600px] overflow-auto">
                        {notifications?.length > 0 ? (
                            notifications.map((noti: Notifications, index: number) => (
                                <div className="mr-[16px]" key={index}>
                                    <NotificationItem
                                        type={noti.notificationTypeId}
                                        message={noti.message}
                                        isRead={noti.isRead}
                                        link={noti.link}
                                        onClickAccept={() => handleClickAccept(noti)}
                                        onClickDecline={() => handleClickDecline(noti)}
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
            {/* Popup choose department */}
            <PopupChooseDepartment
                isVisible={isVisiblePopupDepartment}
                onClickCancel={handleClosePopupDepartment}
                onClickConfirm={handleConfirmDepartment}
            >
                {
                    <div className="flex flex-col items-start w-[400px] select-none">
                        <div className="w-full">
                            <h4 className="text-left mb-1">Department</h4>
                            <Select
                                className="w-full"
                                name="departmentId"
                                size="small"
                                value={departmentId}
                                onChange={handleChooseDepartment}
                            >
                                {departments.map((item: any) => (
                                    <MenuItem key={item.departmentId} value={item.departmentId}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                }
            </PopupChooseDepartment>
        </>
    );
};

export default HeaderLayout;
