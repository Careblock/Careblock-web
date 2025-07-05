import { ExaminationPackagesResponse } from '@/types/examinationPackageResponse.type';
import { ExaminationTypes } from '@/types/examinationType.type';
import { Dayjs } from 'dayjs';

export interface SecondStepProps {
    scheduleData: ExposeData;
    setScheduleData: Function;
    examinationType?: ExaminationTypes;
    setIsNext?: (value: boolean) => void;
}

export interface ExposeData {
    examinationPackage?: ExaminationPackagesResponse;
    date: Dayjs | null;
    time: string;
}
