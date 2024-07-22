import { Organizations } from '@/types/organization.type';

export interface FirstStepProps {
    organization: Organizations | undefined;
    onClickAnOrganization: Function;
}
