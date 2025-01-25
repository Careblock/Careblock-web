import { GENDER } from '../enums/Common';

export interface DataDefaults {
    id?: string;
    patientId?: string;
    organizationThumbnail?: string;
    organizationName: string;
    organizationAddress?: string;
    organizationTel?: string;
    organizationFax?: string;
    organizationUrl?: string;
    fullName: string;
    dateOfBirth?: string;
    gender?: GENDER;
    address?: string;
    doctorId?: string;
    doctorName?: string;
    createdDate?: string;
    walletAddress: string;
}
