import { GENDER } from '../enums/Common';

export interface Accounts {
    id: string;
    departmentId?: string;
    stakeId: string;
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
    createdDate?: string;
    modifiedDate?: string;
    IsDisable: boolean;
    address?: string;
    walletAddress?: string;
    assetToken?: string;
}

export interface AccountSimple {
    firstname: string;
    lastname?: string;
}
