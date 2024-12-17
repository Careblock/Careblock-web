import { AppointmentActionType } from './appointment.type';
import { AppAction } from '@/types/action.type';

export const storeAppointment = (examinationTypeId: string | number): AppAction => {
    return {
        type: AppointmentActionType.STORE_APPOINTMENT,
        payload: { examinationTypeId },
    };
};

export const clearAppointment = (): AppAction => {
    return {
        type: AppointmentActionType.CLEAR_APPOINTMENT,
    };
};
