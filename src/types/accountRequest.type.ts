import { GENDER } from '../enums/Common';

export interface AccountRequest {
    stakeId?: string;
    departmentId?: string;
    firstname: string;
    lastname?: string;
    dateOfBirth?: string;
    gender: GENDER;
    avatar?: string;
    identityId?: string;
    phone?: string;
    email?: string;
    description?: string;
    seniority?: number;
}
