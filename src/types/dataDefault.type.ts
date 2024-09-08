import { GENDER } from '../enums/Common';

export interface DataDefaults {
    organizationThumbnail?: string;
    organizationName: string;
    organizationAddress?: string;
    organizationTel?: string;
    organizationUrl?: string;
    fullName: string;
    dateOfBirth?: string;
    gender?: GENDER;
    address?: string;
    doctorId?: string;
    doctorName?: string;
    createdDate?: string;
}
