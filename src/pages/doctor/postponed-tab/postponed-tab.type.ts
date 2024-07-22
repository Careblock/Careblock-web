import { Patients } from '@/types/patient.type';

export interface PostponedTabType {
    patients?: Patients[];
    handleClickBringBack: Function;
    handleClickCancel: Function;
}
