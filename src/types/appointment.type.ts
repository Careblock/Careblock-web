import { APPOINTMENT_STATUS } from '@/enums/Appointment';

export interface Appointments {
    id?: string;
    doctorId: string;
    patientId: string;
    status: APPOINTMENT_STATUS;
    reason?: string;
    startTime?: string;
    endTime?: string;
    note?: string;
    createdDate?: string;
    modifiedDate?: string;
}
