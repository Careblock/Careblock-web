export interface AppointmentState {
    organizationId: string;
}

export enum AppointmentActionType {
    STORE_APPOINTMENT = 'auth/storeAppointment',
    CLEAR_APPOINTMENT = 'auth/clearAppointment',
}
