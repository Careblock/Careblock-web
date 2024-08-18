import { TimeSlots } from './timeSlot.type';

export interface ExaminationPackagesResponse {
    id?: string;
    organizationId: string;
    examinationTypeId: number;
    name: string;
    thumbnail?: string;
    price: number;
    organizationName: string;
    organizationLocation?: string;
    timeSlots?: TimeSlots[];
}
