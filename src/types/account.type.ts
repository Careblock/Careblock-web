import { BLOODTYPE, GENDER, ROLES } from '../enums/Common';

export interface Accounts {
    id: string;
    organizationId?: string;
    stakeId: string;
    identityId?: string;
    firstname: string;
    lastname?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    gender: GENDER;
    bloodType?: BLOODTYPE;
    role: ROLES;
    dateOfBirth?: string;
    seniority?: number;
    isDeleted: boolean;
    createdBy?: string;
    createdDate?: string;
    modifiedBy?: string;
    modifiedDate?: string;
}

export interface AccountSimple {
    firstname: string;
    lastname?: string;
}
