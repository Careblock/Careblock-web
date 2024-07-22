import { Doctors } from '@/types/doctor.type';
import { Organizations } from '@/types/organization.type';
import { Dayjs } from 'dayjs';

export interface SecondStepProps {
    scheduleData: ExposeData;
    setScheduleData: Function;
    organization?: Organizations;
}

export interface ExposeData {
    doctor?: Doctors;
    date: Dayjs | null;
    time: string;
    price: number;
}

export interface DoctorDataType {
    id: string;
    name: string;
    seniority: number;
    pendingNumber: number;
}
