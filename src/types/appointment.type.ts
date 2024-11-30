import { APPOINTMENT_STATUS } from '@/enums/Appointment';
import { GENDER } from '@/enums/Common';

export interface Appointments {
    id?: string;
    patientId?: string;
    doctorId?: string;
    examinationPackageId?: string;
    status?: APPOINTMENT_STATUS;
    name?: string;
    gender?: GENDER;
    phone?: string;
    email?: string;
    address?: string;
    symptom?: string;
    note?: string;
    reason?: string;
    startDateExpectation?: string;
    endDateExpectation?: string;
    startDateReality?: string;
    endDateReality?: string;
    createdDate?: string;
    modifiedDate?: string;
    isDeleted?: boolean;
}
