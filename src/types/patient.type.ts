import { GENDER, ROLES } from '../enums/Common';

export interface Patients {
    id: string;
    stakeId?: string;
    firstname: string;
    lastname?: string;
    dateOfBirth?: string;
    gender: GENDER;
    phone?: string;
    identityId?: string;
    role: ROLES;
    avatar?: string;
    email?: string;
    description?: string;
    appointmentId?: string;
    createdDate?: string;
    modifiedDate?: string;
    startDateExpectation?: string;
    IsDisable: boolean;
}
