export interface AppointmentRequest {
    pageIndex: number;
    pageNumber: number;
    userId: string;
    doctorId: string;
    keyword?: string;
    examinationTypeId?: number;
    createdDate?: string | Date;
}
