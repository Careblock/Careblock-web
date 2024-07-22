import { Patients } from '@/types/patient.type';

export interface ActiveTabType {
    activePatients?: Patients[];
    handleClickPostpone: Function;
    handleClickCancel: Function;
    handleClickItem: Function | null | undefined;
}
