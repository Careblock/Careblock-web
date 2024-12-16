import { ScheduleTabs } from '@/enums/Common';

export const doctorScheduleTabs: DoctorScheduleTab[] = [
    { name: `Active (0)`, value: ScheduleTabs.ACTIVE },
    { name: `Postponed (0)`, value: ScheduleTabs.POSTPONED },
    { name: `Checked in (0)`, value: ScheduleTabs.CHECKEDIN },
];

export interface DoctorScheduleTab {
    name: string;
    value: string;
}
