import { APPOINTMENT_STATUS } from '@/enums/Appointment';
import { GENDER } from '@/enums/Common';
import { Appointments } from '@/types/appointment.type';

export const getInitValue = (extraData: any) => {
    return {
        patientId: '',
        status: APPOINTMENT_STATUS.ACTIVE,
        name: extraData ? `${extraData?.firstname} ${extraData?.lastname}` : '',
        gender: extraData?.gender ?? GENDER.MALE,
        phone: extraData?.phone,
        email: extraData?.email,
        address: extraData?.address,
        reason: '',
        endDateExpectation: '',
        startDateExpectation: '',
    } as Appointments;
};
