import { AppointmentActionType } from './appointment.type';
import { AppAction } from '@/types/action.type';

export const storeAppointment = (organizationId: string): AppAction => {
    return {
        type: AppointmentActionType.STORE_APPOINTMENT,
        payload: { organizationId },
    };
};

export const clearAppointment = (): AppAction => {
    return {
        type: AppointmentActionType.CLEAR_APPOINTMENT,
    };
};
