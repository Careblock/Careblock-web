import { Card, CardContent, Typography, Button, CardActionArea } from '@mui/material';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import AppointmentService from '@/services/appointment.service';
import AccountService from '@/services/account.service';
import avatarDefault from '@/assets/images/auth/avatarDefault.png';
import { APPOINTMENT_STATUS_NAME } from '@/enums/Appointment';
import { AuthContextType, User } from '@/types/auth.type';
import useObservable from '@/hooks/use-observable.hook';
import { getFullName } from '@/utils/common.helpers';
import { useAuth } from '@/contexts/auth.context';
import { Images } from '@/assets/images';
import { Color } from '@/enums/Color';

const AppointmentHistory = () => {
    const { subscribeOnce } = useObservable();
    const { userData } = useAuth() as AuthContextType;
    const [userInfo, setUserInfo] = useState<any>();
    const [appointmentData, setAppointmentData] = useState([]);
    const [formattedAppointments, setFormattedAppointments] = useState<any>([]);
    const fullName = getFullName(userInfo);

    useEffect(() => {
        subscribeOnce(AccountService.getById(userData?.id), (res: User) => {
            if (res) {
                setUserInfo(res);
            }
        });
    }, []);

    useEffect(() => {
        if (userData) {
            subscribeOnce(AppointmentService.appointment_history_by_id(userData.id), (res: any) => {
                setAppointmentData(res);
            });
        }
    }, []);

    useEffect(() => {
        const formattedData = appointmentData.map((appointment: any) => ({
            avatar: appointment.doctorAvatar,
            patient: fullName,
            doctor: appointment.doctorName,
            organization: appointment.hospitalName,
            reason: appointment.reason,
            status: appointment.status,
            image: appointment.image,
            startTime: format(new Date(appointment.startTime), 'HH:mm'),
            endTime: format(new Date(appointment.endTime), 'HH:mm'),
            createdDate: format(new Date(appointment.createdDate), 'dd/MM/yyyy'),
        }));
        setFormattedAppointments(formattedData);
    }, [appointmentData]);

    const getStatusColor = (status: any) => {
        if (status === APPOINTMENT_STATUS_NAME.ACTIVE) {
            return Color.success;
        } else if (status === APPOINTMENT_STATUS_NAME.POSTPONED) {
            return Color.warning;
        } else if (status === APPOINTMENT_STATUS_NAME.REJECTED) {
            return Color.error;
        } else if (status === APPOINTMENT_STATUS_NAME.CHECKEDIN) {
            return Color.info;
        }
    };

    const getStatusText = (status: any) => {
        if (status === APPOINTMENT_STATUS_NAME.ACTIVE) {
            return APPOINTMENT_STATUS_NAME.ACTIVE;
        } else if (status === APPOINTMENT_STATUS_NAME.POSTPONED) {
            return APPOINTMENT_STATUS_NAME.POSTPONED;
        } else if (status === APPOINTMENT_STATUS_NAME.REJECTED) {
            return APPOINTMENT_STATUS_NAME.REJECTED;
        } else if (status === APPOINTMENT_STATUS_NAME.CHECKEDIN) {
            return APPOINTMENT_STATUS_NAME.CHECKEDIN;
        }
    };

    return (
        <div className="h-full overflow-hidden bg-gray">
            <div className="text-center text-[20px] font-bold mb-3">Appointment History</div>
            <div className="flex justify-center items-center flex-wrap gap-4">
                {formattedAppointments.map((appointment: any, index: any) => (
                    <div className="w-[440px] bg-white" key={index}>
                        <Card>
                            <div className="flex p-4 border-xl shadow-xl">
                                <div className="flex flex-col items-center w-[40%] gap-2 pr-2">
                                    <img
                                        aria-hidden="true"
                                        alt="avatar"
                                        className="w-[60px] h-[60px] object-cover rounded-[175px] border mb-2"
                                        src={appointment.avatar ? appointment.avatar : avatarDefault}
                                    />
                                    <div className="items-center justify-center">
                                        <div className="flex gap-2 items-center">
                                            <Images.LuClock size={18} />
                                            <span>
                                                {appointment.startTime} - {appointment.endTime}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="items-center justify-center">
                                        <div className="flex gap-2 items-center">
                                            <Images.FaRegCalendarAlt size={18} />
                                            <span>{appointment.createdDate}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-y-1 flex-1">
                                    <div className="flex items-center gap-x-2">
                                        <p className="font-bold">Patient:</p>
                                        <p>{appointment.patient}</p>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <p className="font-bold">Doctor:</p>
                                        <p>{appointment.doctor}</p>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <p className="font-bold">Hospital:</p>
                                        <p>{appointment.organization}</p>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <p className="font-bold">Reason:</p>
                                        <p>{appointment.reason}</p>
                                    </div>
                                    <div>
                                        <Button
                                            className="mt-6 p-4 w-[120px] font-bold"
                                            variant="contained"
                                            color={getStatusColor(appointment.status)}
                                        >
                                            {getStatusText(appointment.status)}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AppointmentHistory;
