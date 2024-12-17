import { APPOINTMENT_STATUS } from '@/enums/Appointment';
import { GENDER } from '@/enums/Common';

export interface AppointmentHistory {
    id?: string;
    doctorId?: string;
    organizationId?: string;
    organizationName?: string;
    examinationPackageId?: string;
    examinationPackageName?: string;
    doctorName?: string;
    doctorAvatar?: string;
    patientId: string;
    name?: string;
    gender: GENDER;
    phone: string;
    email?: string;
    address?: string;
    symptom?: string;
    status: APPOINTMENT_STATUS;
    reason?: string;
    note?: string;
    startDateReality?: string;
    endDateReality?: string;
    createdDate?: string;
    startDateExpectation?: string;
    endDateExpectation?: string;
    modifiedDate?: string;
}
