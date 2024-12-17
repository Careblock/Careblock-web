import { Organizations } from '@/types/organization.type';
import { ExposeData } from '../second-step/second-step.type';

export interface FinalStepProps {
    userData: any;
    extraData: any;
    setExtraData: Function;
    organization?: Organizations;
    schedule?: ExposeData;
}
