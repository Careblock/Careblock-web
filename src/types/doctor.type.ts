import { BLOODTYPE, GENDER, ROLES } from '@/enums/Common';

export interface Doctors {
    id: string;
    organizationId?: string;
    stakeId: string;
    identityId?: string;
    firstname: string;
    lastname?: string;
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
    appointments?: ExistedAppointment[];
}

interface ExistedAppointment {
    id: string;
    status: number;
    startTime: string;
    endTime: string;
}
