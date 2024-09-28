import { useEffect, useState } from 'react';
import useObservable from '@/hooks/use-observable.hook';
import { setTitle } from '@/utils/document';
import { FormHelperText, InputAdornment, MenuItem, Select, TextField } from '@mui/material';
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

function TeamMembersPage() {
    const MAX_RECORE_PERPAGE = 9;
    const { subscribeOnce } = useObservable();
    const { userData } = useAuth() as AuthContextType;
    const [initialized, setInitialized] = useState(true);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [doctorDisplays, setDoctorDisplays] = useState<any[]>([]);
    const [doctorOptions, setDoctorOptions] = useState<any[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<any>('');
    const [searchValue, setSearchValue] = useState<string>('');
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [isVisiblePopupConfirm, setIsVisiblePopupConfirm] = useState<boolean>(false);
    const [deletedId, setDeletedId] = useState<string>();

    useEffect(() => {
        setTitle('Team Members | CareBlock');
    }, []);

    useEffect(() => {
        subscribeOnce(AccountService.getDoctorsOrg(Place.Exclusive, userData?.id), (res: Doctors[]) => {
            setDoctorOptions(res);
        });

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

    const getDoctorDatas = () => {
        subscribeOnce(AccountService.getDoctorsOrg(Place.Inclusive, userData?.id), (res: Doctors[]) => {
            setDoctors(res);
            setDoctorDisplays(res.slice(0, 9));
            setTotalPage(Math.ceil(res.length / MAX_RECORE_PERPAGE));
        });
    };

    const handleSelectDoctor = (data: any) => {
        setSelectedDoctor(data);
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

    const handleClickRemove = (doctorId: string) => {
        setDeletedId(doctorId);
        setIsVisiblePopupConfirm(true);
    };

    const handleClosePopupDelete = () => {
        setIsVisiblePopupConfirm(false);
    };

    const handleConfirmDelete = () => {
        subscribeOnce(AccountService.removeDoctorFromOrg(deletedId!), (res: boolean) => {
            if (res === true) {
                setIsVisiblePopupConfirm(false);
                addToast({
                    text: SystemMessage.DELETE_DEPARTMENT,
                    position: 'top-right',
                    status: 'valid',
                });
                getDoctorDatas();
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

    return (
        <div className="mb-[30px]">
            {/* Header */}
            <div className="text-[24px]">Manage Team Members</div>
            <div className="text-[16px] mb-4">Add your team members and manage their details & user permissions.</div>
            <div className="w-full h-full overflow-hidden rounded-md shadow-lg bg-white">
                <div className="border border-[#d7d7d7] w-full pt-[20px] pb-[16px] px-[16px] flex items-center justify-between rounded-t-xl">
                    <div className="flex flex-col w-[260px]">
                        <Select
                            className="w-full"
                            size="medium"
                            value={selectedDoctor}
                            onChange={($event: any) => handleSelectDoctor($event.target.value)}
                        >
                            {doctorOptions.map((item: any) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {`${item.firstname} ${item.lastname}`}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>
                            <span className="block mt-[2px]">Choose a doctor</span>
                        </FormHelperText>
                    </div>
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
                <div className="p-[16px] flex items-center flex-wrap border border-x-[#d7d7d7] justify-between gap-y-[14px]">
                    {doctorDisplays.length > 0 ? (
                        doctorDisplays.map((doctor: Doctors) => (
                            <BaseTeamCard
                                key={doctor.id}
                                dataSource={doctor}
                                onClickRemove={() => handleClickRemove(doctor.id)}
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

            <PopupConfirmDelete
                isVisible={isVisiblePopupConfirm}
                onClickCancel={handleClosePopupDelete}
                onClickConfirm={handleConfirmDelete}
            />
        </div>
    );
}

export default TeamMembersPage;
