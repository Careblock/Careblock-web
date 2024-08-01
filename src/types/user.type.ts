import { BLOODTYPE, GENDER, ROLES } from '@/enums/Common';

export interface EditProfilePatientInitialValues {
    stakeId: string;
    firstname: string;
    lastname: string;
    dateOfBirth: string;
    gender: GENDER;
    avatar?: string;
    email: string;
    phone: string;
    identityId: string;
    bloodType: BLOODTYPE;
    role: ROLES;
}
