import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import CreateConsultation from '../create-consultation/create-consultation.page';
import { formatStandardDate } from '@/utils/datetime.helper';
import { getFullName, getGenderName } from '@/utils/common.helpers';
import avatarDefault from '@/assets/images/auth/avatarDefault.png';
import { DetailsInfoType } from './details-info.type';
import { Images } from '@/assets/images';
import { GENDER, ScheduleTabs } from '@/enums/Common';
import ResultService from '@/services/result.service';
import useObservable from '@/hooks/use-observable.hook';
import { Results } from '@/types/result.type';
import { useSelector } from 'react-redux';
import { NotificationState } from '@/stores/notification';
import * as signalR from '@microsoft/signalr';
import { NotificationType } from '@/enums/NotificationType';
import { Notifications } from '@/types/notification.type';
import { AuthContextType } from '@/types/auth.type';
import { useAuth } from '@/contexts/auth.context';
import { addToast } from '@/components/base/toast/toast.service';
import { SystemMessage } from '@/constants/message.const';
import AccountService from '@/services/account.service';
import { DataDefaults } from '@/types/dataDefault.type';

const DetailsInfo = ({ currentTab, dataSource, clickedSave }: DetailsInfoType) => {
    const { subscribeOnce } = useObservable();
    const [isShowCreatePopup, setIsShowCreatePopup] = useState(false);
    const [result, setResult] = useState<Results[]>([]);
    const [dataDefault, setDataDefault] = useState<DataDefaults>();
    const { userData } = useAuth() as AuthContextType;
    const connection = useSelector((state: { notification: NotificationState }) => state.notification.connection);

    useEffect(() => {
        if (!dataSource?.appointmentId) return;
        subscribeOnce(ResultService.getByAppointmentID(dataSource.appointmentId), (res: Results[]) => {
            setResult(res);
        });

        if (currentTab === ScheduleTabs.CHECKEDIN) {
            subscribeOnce(AccountService.getDefaultData(dataSource.appointmentId), (res: DataDefaults) => {
                setDataDefault(res);
            });
        }
    }, [dataSource]);

    const pushNotification = (result: Results) => {
        let isError = false;

        if (connection.state === signalR.HubConnectionState.Connected) {
            connection
                .invoke('SendNotification', {
                    accountId: dataSource.id,
                    notificationTypeId: NotificationType.Text,
                    message: `${dataDefault?.doctorName} has sent you the results of your medical examination.`,
                    link: result.diagnosticUrl,
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
                        accountId: dataSource.id,
                        notificationTypeId: NotificationType.Text,
                        message: `${dataDefault?.doctorName} has sent you the results of your medical examination.`,
                        link: result.diagnosticUrl,
                        originId: userData?.id,
                        isRead: false,
                    } as Notifications);
                })
                .catch((error: any) => {
                    isError = true;
                    console.error('Lỗi khi kết nối SignalR: ', error);
                });
        }
        if (!isError) addToast({ text: SystemMessage.SEND_RESULT, position: 'top-right' });
    };

    const handleClickAccoummodate = () => {
        setIsShowCreatePopup(true);
    };

    const handleSetIsShowCreatePopup = (type: boolean) => {
        setIsShowCreatePopup(type);
    };

    return (
        <>
            <div className="details__wrapper w-full overflow-hidden bg-white p-4">
                <div className="details__top flex items-center justify-between">
                    <div className="details-top__left flex items-center">
                        <div className="top-left__avatar overflow-hidden rounded-full w-[64px] h-[64px]">
                            <img
                                src={dataSource?.avatar ? dataSource?.avatar : avatarDefault}
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="top-left__name ml-3 text-[18px]">{getFullName(dataSource)}</div>
                    </div>
                    <div className="details-top__right columns-3 space-y-2 w-[400px] select-none">
                        {dataSource.gender && (
                            <div className="gender flex items-center">
                                {dataSource.gender === GENDER.FEMALE ? (
                                    <Images.FemaleIcon className="text-[18px] text-[#4e4e4e]" />
                                ) : (
                                    <Images.MaleIcon className="text-[18px] text-[#4e4e4e]" />
                                )}
                                <div className="text text-[#4e4e4e] ml-1">{getGenderName(dataSource.gender)}</div>
                            </div>
                        )}
                        {dataSource.dateOfBirth && (
                            <div className="date-of-birth flex items-center">
                                <Images.CakeIcon className="text-[18px] text-[#4e4e4e]" />
                                <div className="text text-[#4e4e4e] ml-1">
                                    {formatStandardDate(new Date(dataSource.dateOfBirth))}
                                </div>
                            </div>
                        )}
                        {dataSource.phone && (
                            <div className="phone flex items-center">
                                <Images.PhoneAndroidIcon className="text-[18px] text-[#4e4e4e]" />
                                <div className="text text-[#4e4e4e] ml-1">{dataSource.phone}</div>
                            </div>
                        )}
                        {dataSource.email && (
                            <div className="email flex items-center">
                                <Images.MailOutlineIcon className="text-[18px] text-[#4e4e4e]" />
                                <div className="text text-[#4e4e4e] ml-1">{dataSource.email}</div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="details__content shadow-3 w-full px-4 mt-4 py-8">
                    {result?.length <= 0 ? (
                        <div className="details-content__nodata flex items-center flex-col justify-center">
                            <div className="text-[16px] mb-2">Would you like to begin serving this patient?</div>
                            <Button variant="contained" onClick={handleClickAccoummodate}>
                                Create Consultation
                            </Button>
                        </div>
                    ) : (
                        <ul>
                            {result.map((item: Results, index: number) => (
                                <li key={item.id} className="flex items-center text-[16px]">
                                    <p className="size-[8px] bg-black rounded-full"></p>
                                    <p className="ml-[8px] mr-[10px]">{`Result number ${index + 1}: `}</p>
                                    <a
                                        href={item.diagnosticUrl}
                                        className="text-light-blue-800 hover:underline mr-[20px]"
                                    >
                                        File PDF
                                    </a>
                                    <Button variant="outlined" onClick={() => pushNotification(item)}>
                                        Send result
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <CreateConsultation
                appointmentId={dataSource.appointmentId!}
                patientId={dataSource.id}
                visible={isShowCreatePopup}
                setVisible={handleSetIsShowCreatePopup}
                clickedSave={clickedSave}
            />
        </>
    );
};

export default DetailsInfo;
