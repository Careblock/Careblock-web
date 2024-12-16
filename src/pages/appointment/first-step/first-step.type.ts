import { ExaminationTypes } from '@/types/examinationType.type';

export interface FirstStepProps {
    examinationType: ExaminationTypes | undefined;
    onClickAnExaminationType: Function;
}
