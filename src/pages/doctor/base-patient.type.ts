import { ScheduleTabs } from '@/enums/Common';
import { Patients } from '@/types/patient.type';

export interface BasePatientType {
    no: number;
    patient: Patients;
    className?: string;
    handleClickPositiveIcon: Function;
    handleClickNegativeIcon: Function;
    scheduleTab: ScheduleTabs;
    handleClickItem: Function | null | undefined;
}
