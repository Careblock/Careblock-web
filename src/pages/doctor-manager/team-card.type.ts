import { Doctors } from '@/types/doctor.type';

export interface BaseCardProps {
    dataSource: Doctors;
    isInOrganization: boolean;
    onClickRemove: Function;
    onClickGrant: Function;
    onClickEdit: Function;
    onClickInvite?: Function;
}
