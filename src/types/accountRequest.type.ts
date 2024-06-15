import { BLOODTYPE, GENDER } from '../enums/Common';

export interface AccountRequest {
    identityId?: string;
    firstname: string;
    lastname?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    gender: GENDER;
    bloodType?: BLOODTYPE;
    dateOfBirth?: string;
}
