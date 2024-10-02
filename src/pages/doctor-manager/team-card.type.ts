import { Doctors } from '@/types/doctor.type';

export interface BaseCardProps {
    dataSource: Doctors;
    onClickRemove: Function;
    onClickGrant: Function;
    onClickEdit: Function;
}
