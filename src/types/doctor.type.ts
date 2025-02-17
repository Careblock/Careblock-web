import { GENDER } from '@/enums/Common';

export interface Doctors {
    id: string;
    departmentId: string;
    departmentName?: string;
    stakeId: string;
    identityId?: string;
    firstname: string;
    lastname?: string;
    phone?: string;
    avatar?: string;
    gender: GENDER;
    roles?: string[];
    dateOfBirth?: string;
    seniority?: number;
    email?: string;
    createdBy?: string;
    createdDate?: string;
    modifiedBy?: string;
    modifiedDate?: string;
    appointments?: ExistedAppointment[];
    IsDisable: boolean;
    description?: string;
}

interface ExistedAppointment {
    id: string;
    status: number;
    startTime: string;
    endTime: string;
}
