import { useEffect, useState } from 'react';
import { AuthContextType } from '@/types/auth.type';
import { addToast } from '@/components/base/toast/toast.service';
import useObservable from '@/hooks/use-observable.hook';
import { useAuth } from '@/contexts/auth.context';
import { setTitle } from '@/utils/document';
import {
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
} from '@mui/material';
import { Images } from '@/assets/images';
import { SystemMessage } from '@/constants/message.const';
import { columns } from './invite-members.const';
import { getNotNullString } from '@/utils/string.helper';
import { ToastPositionEnum } from '@/components/base/toast/toast.type';
import { useSelector } from 'react-redux';
import { GlobalState } from '@/stores/global.store';
import { Doctors } from '@/types/doctor.type';
import AccountService from '@/services/account.service';
import { Place } from '@/enums/Place';
import { ROLE_NAMES } from '@/enums/Common';
import avatarDefault from '@/assets/images/auth/avatarDefault.png';
import { Column } from './invite-members.type';
import { getFullName } from '@/utils/common.helpers';
import { NotificationState } from '@/stores/notification';
import * as signalR from '@microsoft/signalr';
import { NotificationType } from '@/enums/NotificationType';
import { Notifications } from '@/types/notification.type';
import { StyledTableCell } from '@/constants/common.const';

function InviteMembersPage() {
    const { subscribeOnce } = useObservable();
    const { userData } = useAuth() as AuthContextType;
    const [initialized, setInitialized] = useState(true);
    const [searchValue, setSearchValue] = useState<string>('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [inviteMembers, setInviteMembers] = useState<any[]>([]);
    const [inviteMembersDisplays, setInviteMembersDisplays] = useState<any[]>([]);
    const collapsed = useSelector((state: GlobalState) => state.system.collapsed);
    const connection = useSelector((state: { notification: NotificationState }) => state.notification.connection);

    useEffect(() => {
        setTitle('Invite Members | CareBlock');

        getDatasource();
    }, []);

    useEffect(() => {
        if (!initialized) {
            let result = inviteMembers.filter((inviteMember: Doctors) => {
                if (
                    inviteMember.firstname.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    inviteMember.lastname?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    inviteMember.phone?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    inviteMember.email?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase())
                ) {
                    return inviteMember;
                }
            });
            setInviteMembersDisplays(result);
            setPage(0);
        } else setInitialized(false);
    }, [searchValue]);

    const getDatasource = () => {
        if (!userData?.id) return;
        subscribeOnce(AccountService.getDoctorsOrg(Place.Exclusive, userData.id), (res: Doctors[]) => {
            if (res) {
                setInviteMembers(res);
                setInviteMembersDisplays(res);
            }
        });
    };

    const handleSearchValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const pushNotification = (doctor: any) => {
        let isError = false;

        if (connection.state === signalR.HubConnectionState.Connected) {
            connection
                .invoke('SendNotification', {
                    accountId: doctor.id,
                    notificationTypeId: NotificationType.Invite,
                    departmentId: doctor.departmentId,
                    message: '',
                    originId: userData?.id,
                    isRead: false,
                } as Notifications)
                .catch((error: any) => {
                    isError = true;
                    console.error('Lỗi khi gọi SignalR: ', error);
                });
        } else {
            connection
                .start()
                .then(() => {
                    connection.invoke('SendNotification', {
                        accountId: doctor.id,
                        notificationTypeId: NotificationType.Invite,
                        departmentId: doctor.departmentId,
                        message: '',
                        originId: userData?.id,
                        isRead: false,
                    } as Notifications);
                })
                .catch((error: any) => {
                    isError = true;
                    console.error('Lỗi khi kết nối SignalR: ', error);
                });
        }
        if (!isError) addToast({ text: SystemMessage.INVITE_MEMBER, position: ToastPositionEnum.TopRight });
    };

    const getCellElement = (inviteMember: Doctors, column: Column, value: any) => {
        if (column.id === 'avatar') {
            return (
                <img
                    src={getNotNullString(value as string, avatarDefault)}
                    alt="Thumbnail"
                    className="size-[50px] object-cover rounded-full"
                />
            );
        }
        if (column.id === 'firstname') {
            return getFullName(inviteMember);
        }
        if (column.id === 'roles') {
            return (
                <div className="flex flex-col gap-y-[4px]">
                    {inviteMember.roles!.includes(ROLE_NAMES.MANAGER) && (
                        <div className="text-center text-white bg-[#672bff] py-[2px] px-[10px] rounded-full select-none">
                            Manager
                        </div>
                    )}
                    {inviteMember.roles!.includes(ROLE_NAMES.DOCTOR) && (
                        <div className="text-center text-white bg-[#1976d2] py-[2px] px-[10px] rounded-full select-none">
                            Doctor
                        </div>
                    )}
                </div>
            );
        }
        if (column.format && typeof value === 'number') {
            return column.format(value);
        }
        return value;
    };

    return (
        <div className={`h-full w-[calc(100vw-${collapsed ? '70px' : '200px'}-40px)]`}>
            <div className="text-[20px] leading-[20px] font-bold">Invite to join the Organization</div>
            <div className="text-[16px] mb-[10px]">
                Add to your team members and manage their details & user permissions.
            </div>
            <div className="toolbar bg-[#f4f4f4] shadow-md rounded-t-md border w-full p-[16px] flex items-center justify-between">
                <TextField
                    variant="outlined"
                    label="Search"
                    size="medium"
                    placeholder="Enter name, phone number or email"
                    className="w-[300px] bg-white"
                    value={searchValue}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSearchValueChanged(event)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Images.SearchIcon className="!text-[28px]" />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer className="max-h-[calc(100vh-52px-30px-20px-34px-88px-52px)]">
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <StyledTableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        <div className="font-bold uppercase">{column.label}</div>
                                    </StyledTableCell>
                                ))}
                                <StyledTableCell key="actions" align="center" style={{ minWidth: 150 }}>
                                    <div className="font-bold uppercase">Actions</div>
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inviteMembersDisplays
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((inviteMember: Doctors) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={inviteMember.id}>
                                            {columns.map((column) => {
                                                const value = inviteMember[column.id];
                                                return (
                                                    <StyledTableCell key={column.id} align={column.align}>
                                                        {getCellElement(inviteMember, column, value)}
                                                    </StyledTableCell>
                                                );
                                            })}
                                            <StyledTableCell key="action" align="center">
                                                <div className="flex items-center justify-center gap-x-[16px] border-[#d6d6d6] w-full">
                                                    <Images.FcInvite
                                                        className="text-[40px] px-[6px] rounded-full hover:bg-[#ddd] cursor-pointer text-[black]"
                                                        title="Invite to join the organization"
                                                        onClick={() => pushNotification(inviteMember)}
                                                    />
                                                </div>
                                            </StyledTableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    className="border-t bg-[#f4f4f4]"
                    count={inviteMembersDisplays.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}

export default InviteMembersPage;
