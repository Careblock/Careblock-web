import { ScheduleTabs } from '@/enums/Common';
import { Patients } from '@/types/patient.type';

export interface DetailsInfoType {
    dataSource: Patients;
    clickedSave: Function;
    currentTab: ScheduleTabs;
}
