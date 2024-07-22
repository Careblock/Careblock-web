import { Organizations } from '@/types/organization.type';
import { ExposeData } from '../second-step/second-step.type';

export interface FinalStepProps {
    reason: string;
    setReason: Function;
    organization?: Organizations;
    schedule?: ExposeData;
}
