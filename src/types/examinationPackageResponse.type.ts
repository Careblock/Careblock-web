import { APPOINTMENT_STATUS } from '@/enums/Appointment';
import { TimeSlots } from './timeSlot.type';

export interface ExaminationPackagesResponse {
    id?: string;
    organizationId: string;
    examinationTypeId: number;
    name: string;
    thumbnail?: string;
    price: number;
    organizationName: string;
    organizationLocation?: string;
    timeSlots?: TimeSlots[];
    appointments?: ExistedAppointment[];
}

export interface ExistedAppointment {
    id?: string;
    status: APPOINTMENT_STATUS;
    startDateExpectation?: string;
    endDateExpectation?: string;
}
