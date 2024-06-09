import { BLOODTYPE, GENDER, ROLES } from '@/enums/Common';

export interface EditProfilePatientInitialValues {
    stakeId: string;
    firstname: string;
    lastname: string;
    dateOfBirth: string;
    gender: GENDER;
    email: string;
    identityId: string;
    bloodType: BLOODTYPE;
    phone: string;
    role: ROLES;
}
