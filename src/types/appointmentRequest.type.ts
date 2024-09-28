export interface AppointmentRequest {
    pageIndex: number;
    pageNumber: number;
    userId: string;
    keyword?: string;
    examinationTypeId?: number;
    createdDate?: string | Date;
}
