export interface AppointmentState {
    examinationTypeId: string | number;
}

export enum AppointmentActionType {
    STORE_APPOINTMENT = 'auth/storeAppointment',
    CLEAR_APPOINTMENT = 'auth/clearAppointment',
}
