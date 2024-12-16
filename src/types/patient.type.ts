import { GENDER } from '../enums/Common';

export interface Patients {
    id: string;
    firstname?: string;
    lastname?: string;
    name: string;
    reason: string;
    examinationPackageName: string;
    address: string;
    email?: string;
    gender: GENDER;
    phone?: string;
    dateOfBirth?: string;
    avatar?: string;
    startDateExpectation?: string;
    appointmentId?: string;
}
