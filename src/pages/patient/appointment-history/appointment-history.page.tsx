import { Card, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import AppointmentService from '@/services/appointment.service';
import avatarDefault from '@/assets/images/auth/avatarDefault.png';
import { APPOINTMENT_STATUS_NAME } from '@/enums/Appointment';
import { AuthContextType } from '@/types/auth.type';
import useObservable from '@/hooks/use-observable.hook';
import { useAuth } from '@/contexts/auth.context';
import { Images } from '@/assets/images';
import { Color } from '@/enums/Color';
import { setTitle } from '@/utils/document';

const AppointmentHistory = () => {
    const { subscribeOnce } = useObservable();
    const { userData } = useAuth() as AuthContextType;
    const [appointmentData, setAppointmentData] = useState([]);
    const [formattedAppointments, setFormattedAppointments] = useState<any>([]);

    useEffect(() => {
        setTitle('Appointment history | CareBlock');
    }, []);

    useEffect(() => {
        if (userData) {
            subscribeOnce(AppointmentService.getAppointmentHistories(userData.id), (res: any) => {
                setAppointmentData(res);
            });
        }
    }, []);

    useEffect(() => {
        const formattedData = appointmentData.map((appointment: any) => ({
            id: appointment.id,
            doctorName: appointment.doctorName?.trim(),
            doctorAvatar: appointment.doctorAvatar,
            name: appointment.name?.trim(),
            gender: appointment.gender,
            phone: appointment.phone?.trim(),
            email: appointment.email?.trim(),
            address: appointment.address?.trim(),
            hospitalName: appointment.hospitalName?.trim(),
            reason: appointment.reason?.trim(),
            endDateExpectation: format(new Date(appointment.endDateExpectation), 'HH:mm'),
            startDateExpectation: format(new Date(appointment.startDateExpectation), 'HH:mm'),
            dateExpectation: format(new Date(appointment.startDateExpectation), 'dd/MM/yyyy'),
            patientId: appointment.patientId,
            doctorId: appointment.doctorAvatar,
            symptom: appointment.symptom?.trim(),
            note: appointment.note?.trim(),
            status: appointment.status,
            createdDate: format(new Date(appointment.createdDate), 'dd/MM/yyyy'),
            endDateReality: format(new Date(appointment.endDateReality), 'HH:mm'),
            startDateReality: format(new Date(appointment.startDateReality), 'HH:mm'),
            dateReality: format(new Date(appointment.startDateReality), 'dd/MM/yyyy'),
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
                {formattedAppointments.map((appointment: any) => (
                    <div className="w-[440px] bg-white" key={appointment.id}>
                        <Card>
                            <div className="flex p-4 border-xl shadow-xl h-[222px]">
                                <div className="flex flex-col items-center w-[40%] gap-2 pr-2">
                                    <img
                                        aria-hidden="true"
                                        alt="avatar"
                                        className="w-[60px] h-[60px] object-cover rounded-[175px] border mb-2"
                                        src={appointment.doctorAvatar ? appointment.doctorAvatar : avatarDefault}
                                    />
                                    <div className="items-center justify-center">
                                        <div className="flex gap-2 items-center">
                                            <Images.LuClock size={18} />
                                            <span>
                                                {appointment.startDateExpectation} - {appointment.endDateExpectation}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="items-center justify-center">
                                        <div className="flex gap-2 items-center">
                                            <Images.FaRegCalendarAlt size={18} />
                                            <span>{appointment.dateExpectation}</span>
                                        </div>
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
                                <div className="flex flex-col gap-y-1 flex-1">
                                    {appointment.doctorName && (
                                        <div className="flex items-center gap-x-2">
                                            <p className="font-bold">Doctor:</p>
                                            <p>{appointment.doctorName}</p>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-x-2">
                                        <p className="font-bold">Hospital:</p>
                                        <p>{appointment.address}</p>
                                    </div>
                                    {appointment.reason && (
                                        <div className="flex items-center gap-x-2">
                                            <p className="font-bold">Reason:</p>
                                            <p>{appointment.reason}</p>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-x-2">
                                        <p className="font-bold">Patient:</p>
                                        <p>{appointment.name}</p>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <p className="font-bold">Gender:</p>
                                        <p>{appointment.gender}</p>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <p className="font-bold">Phone:</p>
                                        <p>{appointment.phone}</p>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <p className="font-bold">Email:</p>
                                        <p>{appointment.email}</p>
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
