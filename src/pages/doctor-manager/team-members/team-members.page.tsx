import { useEffect, useState } from 'react';
import useObservable from '@/hooks/use-observable.hook';
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
    Select,
    TextField,
    useTheme,
} from '@mui/material';
import { Images } from '@/assets/images';
import BaseTeamCard from '../team-card.component';
import AccountService from '@/services/account.service';
import { Doctors } from '@/types/doctor.type';
import { AuthContextType } from '@/types/auth.type';
import { useAuth } from '@/contexts/auth.context';
import { Place } from '@/enums/Place';
import { addToast } from '@/components/base/toast/toast.service';
import { SystemMessage } from '@/constants/message.const';
import PopupConfirmDelete from '@/components/base/popup/popup-confirm-delete.component';
import PopupGrantPermission from '../popup-grant-permisstion/popup-grant-permission.component';
import { ROLE_NAMES } from '@/enums/Common';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/enums/RoutePath';
import PopupEditInformation from '../popup-edit-information/popup-edit-information.component';
import { getStyles, MenuProps } from './team-members.const';
import SpecialistService from '@/services/specialist.service';
import { Specialists } from '@/types/specialist.type';
import { EMPTY_GUID } from '@/constants/common.const';

function TeamMembersPage() {
    const MAX_RECORE_PERPAGE = 9;
    const theme = useTheme();
    const navigate = useNavigate();
    const { subscribeOnce } = useObservable();
    const { userData } = useAuth() as AuthContextType;
    const [initialized, setInitialized] = useState(true);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [doctorDisplays, setDoctorDisplays] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [isVisiblePopupConfirm, setIsVisiblePopupConfirm] = useState<boolean>(false);
    const [isVisiblePopupGrant, setIsVisiblePopupGrant] = useState<boolean>(false);
    const [isVisiblePopupEdit, setIsVisiblePopupEdit] = useState<boolean>(false);
    const [deletedId, setDeletedId] = useState<string>();
    const [grantedDoctor, setGrantedDoctor] = useState<any>();
    const [editDoctor, setEditDoctor] = useState<any>();
    const [permissionCheckedList, setPermissionCheckedList] = useState<boolean[]>([false, false]);
    const [specialist, setSpecialist] = useState<any[]>([]);
    const [selectedSpecialist, setSelectedSpecialist] = useState<any[]>([]);

    useEffect(() => {
        setTitle('Team Members | CareBlock');

        getSpecialistData();
        getDoctorDatas();
    }, []);

    useEffect(() => {
        if (!initialized) {
            if (searchValue.trim() === '') {
                setDoctorDisplays(doctors.slice(0, 9));
                setPageIndex(1);
                setTotalPage(Math.ceil(doctors.length / MAX_RECORE_PERPAGE));
            } else {
                let result = doctors.filter((doctor: Doctors) => {
                    if (
                        doctor.firstname.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                        doctor.lastname?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                        doctor.phone?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                        doctor.email?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase())
                    )
                        return doctor;
                });
                setDoctorDisplays(result);
                setPageIndex(1);
                setTotalPage(1);
            }
        } else setInitialized(false);
    }, [searchValue]);

    const getSpecialistData = () => {
        if (!userData?.id) return;
        subscribeOnce(SpecialistService.getByUserId(userData.id), (res: Specialists[]) => {
            setSpecialist(res);
        });
    };

    const getDoctorDatas = () => {
        if (!userData?.id) return;
        subscribeOnce(AccountService.getDoctorsOrg(Place.Inclusive, userData.id), (res: Doctors[]) => {
            setDoctors(res);
            setDoctorDisplays(res.slice(0, 9));
            setTotalPage(Math.ceil(res.length / MAX_RECORE_PERPAGE));
        });
    };

    const handleSearchValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleClickPrevious = () => {
        const prevIndex = pageIndex - 1;
        if (prevIndex > 0) {
            setDoctorDisplays(
                doctors.slice(
                    (prevIndex - 1) * MAX_RECORE_PERPAGE,
                    (prevIndex - 1) * MAX_RECORE_PERPAGE + MAX_RECORE_PERPAGE
                )
            );
            setPageIndex(prevIndex);
        }
    };

    const handleClickNext = () => {
        const nextIndex = pageIndex + 1;
        if (nextIndex <= totalPage) {
            setDoctorDisplays(
                doctors.slice(pageIndex * MAX_RECORE_PERPAGE, pageIndex * MAX_RECORE_PERPAGE + MAX_RECORE_PERPAGE)
            );
            setPageIndex(nextIndex);
        }
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
        const ids = specialist.map((sp: Specialists) => sp.id);
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
                setIsVisiblePopupConfirm(false);
                addToast({
                    text: SystemMessage.DELETE_DEPARTMENT,
                    position: 'top-right',
                    status: 'valid',
                });
                getDoctorDatas();

                if (deletedId === userData!.id) {
                    navigate({
                        pathname: PATHS.LOGOUT,
                    });
                }
            } else {
                setIsVisiblePopupConfirm(false);
                addToast({
                    text: SystemMessage.DELETE_DEPARTMENT_FAILED,
                    position: 'top-right',
                    status: 'warn',
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
                    position: 'top-right',
                    status: 'warn',
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
        return specialist.filter((item: Specialists) => item.id === id)[0]?.name ?? '';
    };

    const handleGrantPermission = (permissionRequest: string[]) => {
        if (!grantedDoctor.id) return;
        subscribeOnce(AccountService.grantPermission(grantedDoctor.id, permissionRequest), (res: boolean) => {
            if (res === true) {
                setIsVisiblePopupGrant(false);
                addToast({
                    text: SystemMessage.GRANT_SUCCESS,
                    position: 'top-right',
                    status: 'valid',
                });
                getDoctorDatas();

                if (grantedDoctor.id === userData!.id) {
                    navigate({
                        pathname: PATHS.LOGOUT,
                    });
                }
            } else {
                setIsVisiblePopupGrant(false);
                addToast({
                    text: SystemMessage.GRANT_FAILED,
                    position: 'top-right',
                    status: 'warn',
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
                    position: 'top-right',
                    status: 'valid',
                });
                getDoctorDatas();
            } else {
                setIsVisiblePopupEdit(false);
                addToast({
                    text: SystemMessage.EDIT_SPECIALIST_FAILED,
                    position: 'top-right',
                    status: 'warn',
                });
            }
        });
    };

    return (
        <div className="mb-[30px]">
            {/* Header */}
            <div className="text-[24px]">Manage Team Members</div>
            <div className="text-[16px] mb-4">Add your team members and manage their details & user permissions.</div>
            <div className="w-full h-full overflow-hidden rounded-md shadow-lg bg-white">
                <div className="border border-[#d7d7d7] w-full pt-[20px] pb-[16px] px-[16px] flex items-center justify-between rounded-t-xl">
                    <TextField
                        variant="outlined"
                        label="Search"
                        helperText="Enter name, phone number or email"
                        className="w-[260px]"
                        value={searchValue}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSearchValueChanged(event)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Images.SearchIcon className="text-[24px]" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                {/* Content */}
                <div className="p-[16px] flex items-center flex-wrap border border-x-[#d7d7d7] gap-y-[14px] gap-x-[16px]">
                    {doctorDisplays.length > 0 ? (
                        doctorDisplays.map((doctor: Doctors) => (
                            <BaseTeamCard
                                key={doctor.id}
                                isInOrganization={true}
                                dataSource={doctor}
                                onClickRemove={($event: any) => handleClickRemove(doctor.id, $event)}
                                onClickGrant={() => handleClickGrant(doctor)}
                                onClickEdit={() => handleClickEdit(doctor)}
                            />
                        ))
                    ) : (
                        <div className="mb-6 flex items-center flex-col justify-center w-full">
                            <div className="image w-[300px] overflow-hidden">
                                <img className="w-full object-cover" src={Images.BgNodata} alt="no data" />
                            </div>
                            <div className="text-[20px]">No data to display</div>
                        </div>
                    )}
                </div>
                {/* Footer */}
                <div className="border border-[#d7d7d7] w-full p-[16px] flex items-center justify-center rounded-b-xl gap-x-[8px] select-none">
                    <div
                        className="flex items-center justify-center cursor-pointer rounded-full size-[30px] hover:bg-[#eee]"
                        onClick={handleClickPrevious}
                    >
                        <Images.ArrowBackIosNewIcon />
                    </div>
                    <p className="text-[16px]">
                        {pageIndex}/{totalPage}
                    </p>
                    <div
                        className="flex items-center justify-center cursor-pointer rounded-full size-[30px] hover:bg-[#eee]"
                        onClick={handleClickNext}
                    >
                        <Images.ArrowForwardIosIcon />
                    </div>
                </div>
            </div>

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
                                size="small"
                                checked={permissionCheckedList[0]}
                                onChange={($event: any) => handleCheckboxChange($event, 0)}
                            />
                            <p>Doctor</p>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <Checkbox
                                id="policy"
                                size="small"
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
