import { Patients } from '@/types/patient.type';

export interface CheckedinTabType {
    patients?: Patients[];
    handleClickItem: Function | null | undefined;
}
