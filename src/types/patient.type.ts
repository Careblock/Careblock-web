import { BLOODTYPE, GENDER, ROLES } from '../enums/Common';

export interface Patients {
    id: string;
    firstname: string;
    lastname?: string;
    dateOfBirth?: string;
    gender: GENDER;
    bloodType?: BLOODTYPE;
    phone?: string;
    role: ROLES;
    avatar?: string;
    createdDate?: string;
    appointmentId?: string;
}
