import { useEffect, useState } from 'react';
import { AuthContextType } from '@/types/auth.type';
import { addToast } from '@/components/base/toast/toast.service';
import useObservable from '@/hooks/use-observable.hook';
import { useAuth } from '@/contexts/auth.context';
import { setTitle } from '@/utils/document';
import {
    Box,
    Checkbox,
    Chip,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    useTheme,
} from '@mui/material';
import { Images } from '@/assets/images';
import { SystemMessage } from '@/constants/message.const';
import PopupConfirmDelete from '@/components/base/popup/popup-confirm-delete.component';
import { columns, getStyles, MenuProps } from './team-members.const';
import { getNotNullString } from '@/utils/string.helper';
import { ToastPositionEnum, ToastStatusEnum } from '@/components/base/toast/toast.type';
import { useSelector } from 'react-redux';
import { GlobalState } from '@/stores/global.store';
import { Doctors } from '@/types/doctor.type';
import SpecialistService from '@/services/specialist.service';
import AccountService from '@/services/account.service';
import { Place } from '@/enums/Place';
import { ROLE_NAMES } from '@/enums/Common';
import { EMPTY_GUID, StyledTableCell } from '@/constants/common.const';
import { PATHS } from '@/enums/RoutePath';
import { useNavigate } from 'react-router-dom';
import PopupEditInformation from '../popup-edit-information/popup-edit-information.component';
import PopupGrantPermission from '../popup-grant-permisstion/popup-grant-permission.component';
import avatarDefault from '@/assets/images/auth/avatarDefault.png';
import { Specialists } from '@/types/specialist.type';
import { Column } from './team-members.type';
import { getFullName } from '@/utils/common.helpers';

function TeamMembersPage() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { subscribeOnce } = useObservable();
    const { userData } = useAuth() as AuthContextType;
    const [initialized, setInitialized] = useState(true);
    const collapsed = useSelector((state: GlobalState) => state.system.collapsed);
    const [searchValue, setSearchValue] = useState<string>('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [teamMembersDisplays, setTeamMembersDisplays] = useState<any[]>([]);
    const [isVisiblePopupEdit, setIsVisiblePopupEdit] = useState<boolean>(false);
    const [isVisiblePopupConfirm, setIsVisiblePopupConfirm] = useState<boolean>(false);
    const [isVisiblePopupGrant, setIsVisiblePopupGrant] = useState<boolean>(false);
    const [deletedId, setDeletedId] = useState<string>();
    const [grantedDoctor, setGrantedDoctor] = useState<any>();
    const [permissionCheckedList, setPermissionCheckedList] = useState<boolean[]>([false, false]);
    const [editDoctor, setEditDoctor] = useState<any>();
    const [specialist, setSpecialist] = useState<any[]>([]);
    const [selectedSpecialist, setSelectedSpecialist] = useState<any[]>([]);

    useEffect(() => {
        setTitle('Team Members | CareBlock');

        getSpecialistData();
        getDatasource();
    }, []);

    useEffect(() => {
        if (!initialized) {
            let result = teamMembers.filter((teamMember: Doctors) => {
                if (
                    teamMember.firstname.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    teamMember.lastname?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    teamMember.phone?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    teamMember.email?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase())
                ) {
                    return teamMember;
                }
            });
            setTeamMembersDisplays(result);
            setPage(0);
        } else setInitialized(false);
    }, [searchValue]);

    const getSpecialistData = () => {
        if (!userData?.id) return;
        subscribeOnce(SpecialistService.getByUserId(userData.id), (res: Specialists[]) => {
            setSpecialist(res);
        });
    };

    const getDatasource = () => {
        if (!userData?.id) return;
        subscribeOnce(AccountService.getDoctorsOrg(Place.Inclusive, userData.id), (res: Doctors[]) => {
            if (res) {
                setTeamMembers(res);
                setTeamMembersDisplays(res);
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

    const handleClickRemove = (doctorId: string, event: any) => {
        event.stopPropagation();
        setDeletedId(doctorId);
        setIsVisiblePopupConfirm(true);
    };

    const handleClickGrant = (doctor: any) => {
        let temp = [false, false];
        if (doctor.roles.includes(ROLE_NAMES.DOCTOR)) temp[0] = true;
        if (doctor.roles.includes(ROLE_NAMES.MANAGER)) temp[1] = true;
        setPermissionCheckedList([...temp]);

        setGrantedDoctor(doctor);
        setIsVisiblePopupGrant(true);
    };

    const handleClickEdit = (doctor: any) => {
        const specialistData: any[] = doctor.specialist.filter((spec: string) => spec !== EMPTY_GUID);
        const ids = specialist.map((sp: Doctors) => sp.id);
        const existedIds = specialistData.filter((item: string) => ids.includes(item));
        let result = new Set();
        if (existedIds.length) {
            specialistData.forEach((item: string) => result.add(item));
            setSelectedSpecialist(Array.from(result));
        } else {
            setSelectedSpecialist([]);
        }
        setEditDoctor(doctor);
        setIsVisiblePopupEdit(true);
    };

    const handleClosePopupDelete = () => {
        setIsVisiblePopupConfirm(false);
    };

    const handleClosePopupGrant = () => {
        setIsVisiblePopupGrant(false);
    };

    const handleClosePopupEdit = () => {
        setIsVisiblePopupEdit(false);
    };

    const handleConfirmDelete = () => {
        if (!deletedId) return;
        subscribeOnce(AccountService.removeDoctorFromOrg(deletedId), (res: boolean) => {
            if (res === true) {
                setPage(0);
                setIsVisiblePopupConfirm(false);
                addToast({
                    text: SystemMessage.DELETE_DEPARTMENT,
                    position: ToastPositionEnum.TopRight,
                    status: ToastStatusEnum.Valid,
                });
                getDatasource();

                if (deletedId === userData!.id) {
                    navigate({
                        pathname: PATHS.LOGOUT,
                    });
                }
            } else {
                setIsVisiblePopupConfirm(false);
                addToast({
                    text: SystemMessage.DELETE_DEPARTMENT_FAILED,
                    position: ToastPositionEnum.TopRight,
                    status: ToastStatusEnum.Warn,
                });
            }
        });
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        setPermissionCheckedList((oldValue) => {
            let newValue = [...oldValue];
            newValue[index] = event.target.checked;
            if (newValue.every((checkItem: boolean) => !checkItem)) {
                addToast({
                    text: SystemMessage.AT_LEAST_ONE_ROLE,
                    position: ToastPositionEnum.TopRight,
                    status: ToastStatusEnum.Warn,
                });
                return [...oldValue];
            }
            return [...newValue];
        });
    };

    const handleSelectSpecialist = (event: any) => {
        const { target: value } = event;
        setSelectedSpecialist(typeof value.value === 'string' ? value.value.split(',') : value.value);
    };

    const getSpecialistName = (id: string) => {
        return specialist.filter((item: Doctors) => item.id === id)[0]?.name ?? '';
    };

    const handleGrantPermission = (permissionRequest: string[]) => {
        if (!grantedDoctor.id) return;
        subscribeOnce(AccountService.grantPermission(grantedDoctor.id, permissionRequest), (res: boolean) => {
            if (res === true) {
                setIsVisiblePopupGrant(false);
                addToast({
                    text: SystemMessage.GRANT_SUCCESS,
                    position: ToastPositionEnum.TopRight,
                    status: ToastStatusEnum.Valid,
                });
                getDatasource();

                if (grantedDoctor.id === userData!.id) {
                    navigate({
                        pathname: PATHS.LOGOUT,
                    });
                }
            } else {
                setIsVisiblePopupGrant(false);
                addToast({
                    text: SystemMessage.GRANT_FAILED,
                    position: ToastPositionEnum.TopRight,
                    status: ToastStatusEnum.Warn,
                });
            }
        });
    };

    const handleConfirmGrant = () => {
        const permissionRequest = permissionCheckedList.map((item: boolean, index: number) => {
            if (index === 0 && item === true) return ROLE_NAMES.DOCTOR;
            else if (index === 1 && item === true) return ROLE_NAMES.MANAGER;
        });

        handleGrantPermission(permissionRequest as string[]);
    };

    const handleConfirmEdit = () => {
        if (!editDoctor.id) return;
        subscribeOnce(SpecialistService.assignSpecialist(editDoctor.id, selectedSpecialist), (res: boolean) => {
            if (res === true) {
                setIsVisiblePopupEdit(false);
                addToast({
                    text: SystemMessage.EDIT_SPECIALIST,
                    position: ToastPositionEnum.TopRight,
                    status: ToastStatusEnum.Valid,
                });
                getDatasource();
            } else {
                setIsVisiblePopupEdit(false);
                addToast({
                    text: SystemMessage.EDIT_SPECIALIST_FAILED,
                    position: ToastPositionEnum.TopRight,
                    status: ToastStatusEnum.Warn,
                });
            }
        });
    };

    const getCellElement = (teamMember: Doctors, column: Column, value: any) => {
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
            return getFullName(teamMember);
        }
        if (column.id === 'roles') {
            return (
                <div className="flex flex-col gap-y-[4px]">
                    {teamMember.roles!.includes(ROLE_NAMES.MANAGER) && (
                        <div className="text-center text-white bg-[#672bff] py-[2px] px-[10px] rounded-full select-none">
                            Manager
                        </div>
                    )}
                    {teamMember.roles!.includes(ROLE_NAMES.DOCTOR) && (
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
            <div className="text-[20px] leading-[20px] font-bold">Manage Team Members</div>
            <div className="text-[16px] mb-[10px]">
                Add your team members and manage their details & user permissions.
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
                            {teamMembersDisplays
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((teamMember: Doctors) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={teamMember.id}>
                                            {columns.map((column) => {
                                                const value = teamMember[column.id];
                                                return (
                                                    <StyledTableCell key={column.id} align={column.align}>
                                                        {getCellElement(teamMember, column, value)}
                                                    </StyledTableCell>
                                                );
                                            })}
                                            <StyledTableCell key="action" align="center">
                                                <div className="flex items-center justify-center gap-x-[16px] border-[#d6d6d6] w-full">
                                                    <Images.FaClipboardUser
                                                        title="Assign specialist"
                                                        className="text-[26px] cursor-pointer hover:text-[#bc8c39]"
                                                        onClick={() => handleClickEdit(teamMember)}
                                                    />
                                                    <Images.RiAdminFill
                                                        title="Grant permissions"
                                                        className="text-[26px] cursor-pointer hover:text-[#3986bc]"
                                                        onClick={() => handleClickGrant(teamMember)}
                                                    />
                                                    <Images.MdDelete
                                                        title="Remove from the organization"
                                                        className="text-[26px] cursor-pointer hover:text-[red]"
                                                        onClick={($event: any) =>
                                                            handleClickRemove(teamMember.id, $event)
                                                        }
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
                    count={teamMembersDisplays.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Edit information */}
            <PopupEditInformation
                isVisible={isVisiblePopupEdit}
                onClickCancel={handleClosePopupEdit}
                onClickConfirm={handleConfirmEdit}
            >
                {
                    <div className="flex flex-col items-start w-[400px] select-none">
                        <FormControl sx={{ m: 1, width: 380 }}>
                            <InputLabel id="multiple-specialist-label">Specialist</InputLabel>
                            <Select
                                multiple
                                size="medium"
                                className="w-full"
                                labelId="multiple-specialist-label"
                                value={selectedSpecialist}
                                onChange={handleSelectSpecialist}
                                input={<OutlinedInput id="select-multiple-specialist" label="Specialist" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((data) => (
                                            <Chip key={data} label={getSpecialistName(data)} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {specialist.map((item: Specialists) => (
                                    <MenuItem
                                        key={item.id}
                                        value={item.id}
                                        style={getStyles(item.name, selectedSpecialist, theme)}
                                    >
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                }
            </PopupEditInformation>
            {/* Grant permission */}
            <PopupGrantPermission
                isVisible={isVisiblePopupGrant}
                onClickCancel={handleClosePopupGrant}
                onClickConfirm={handleConfirmGrant}
            >
                {
                    <div className="flex flex-col items-start w-[320px] select-none">
                        <label className="flex items-center cursor-pointer">
                            <Checkbox
                                id="policy"
                                size="medium"
                                checked={permissionCheckedList[0]}
                                onChange={($event: any) => handleCheckboxChange($event, 0)}
                            />
                            <p>Doctor</p>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <Checkbox
                                id="policy"
                                size="medium"
                                checked={permissionCheckedList[1]}
                                onChange={($event: any) => handleCheckboxChange($event, 1)}
                            />
                            <p>Manager</p>
                        </label>
                    </div>
                }
            </PopupGrantPermission>
            {/* Delete */}
            <PopupConfirmDelete
                isVisible={isVisiblePopupConfirm}
                onClickCancel={handleClosePopupDelete}
                onClickConfirm={handleConfirmDelete}
            />
        </div>
    );
}

export default TeamMembersPage;
