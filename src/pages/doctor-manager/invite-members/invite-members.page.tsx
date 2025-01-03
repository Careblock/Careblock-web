import { useEffect, useState } from 'react';
import { addToast } from '@/components/base/toast/toast.service';
import useObservable from '@/hooks/use-observable.hook';
import { setTitle } from '@/utils/document';
import { InputAdornment, TextField } from '@mui/material';
import { Images } from '@/assets/images';
import BaseTeamCard from '../team-card.component';
import AccountService from '@/services/account.service';
import { Doctors } from '@/types/doctor.type';
import { AuthContextType } from '@/types/auth.type';
import { useAuth } from '@/contexts/auth.context';
import { Place } from '@/enums/Place';
import { Notifications } from '@/types/notification.type';
import { NotificationType } from '@/enums/NotificationType';
import { SystemMessage } from '@/constants/message.const';
import { useSelector } from 'react-redux';
import { NotificationState } from '@/stores/notification';
import * as signalR from '@microsoft/signalr';
import Nodata from '@/components/base/no-data/nodata.component';
import { ToastPositionEnum } from '@/components/base/toast/toast.type';

function InviteMembersPage() {
    const MAX_RECORE_PERPAGE = 9;
    const { subscribeOnce } = useObservable();
    const { userData } = useAuth() as AuthContextType;
    const [initialized, setInitialized] = useState(true);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [doctorDisplays, setDoctorDisplays] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const connection = useSelector((state: { notification: NotificationState }) => state.notification.connection);

    useEffect(() => {
        setTitle('Invite Members | CareBlock');

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
        if (!userData?.id) return;
        subscribeOnce(AccountService.getDoctorsOrg(Place.Exclusive, userData.id), (res: Doctors[]) => {
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

    return (
        <div>
            {/* Header */}
            <div className="text-[20px] leading-[20px] font-bold">Invite to join the Organization</div>
            <div className="text-[16px] mb-[10px]">
                Add to your team members and manage their details & user permissions.
            </div>
            <div className="w-full h-full overflow-hidden rounded-md shadow-lg">
                <div className="toolbar bg-[#f4f4f4] rounded-t-md border w-full p-[16px] flex items-center justify-between">
                    <TextField
                        variant="outlined"
                        label="Search"
                        placeholder="Enter name, phone number or email"
                        className="w-[300px]"
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
                {/* Content */}
                <div className="p-[16px] flex items-center flex-wrap border border-x-[#d7d7d7] gap-y-[14px] gap-x-[16px]">
                    {doctorDisplays.length > 0 ? (
                        doctorDisplays.map((doctor: Doctors) => (
                            <BaseTeamCard
                                key={doctor.id}
                                isInOrganization={false}
                                dataSource={doctor}
                                onClickRemove={() => {}}
                                onClickGrant={() => {}}
                                onClickEdit={() => {}}
                                onClickInvite={() => pushNotification(doctor)}
                            />
                        ))
                    ) : (
                        <div className="w-[260px] mx-auto">
                            <Nodata />
                        </div>
                    )}
                </div>
                {/* Footer */}
                <div className="border bg-[#f4f4f4] border-[#d7d7d7] w-full p-[14px] flex items-center justify-center rounded-b-xl gap-x-[8px] select-none">
                    <div
                        className="flex items-center justify-center cursor-pointer rounded-full hover:bg-[#eee]"
                        onClick={handleClickPrevious}
                    >
                        <Images.ArrowBackIosNewIcon />
                    </div>
                    <p className="text-[16px]">
                        {pageIndex}/{totalPage}
                    </p>
                    <div
                        className="flex items-center justify-center cursor-pointer rounded-full hover:bg-[#eee]"
                        onClick={handleClickNext}
                    >
                        <Images.ArrowForwardIosIcon fontSize="small" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InviteMembersPage;
