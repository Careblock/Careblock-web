export interface ExaminationPackageReview {
    id?: string;
    examinationPackageId: string;
    resultId?: string;
    appointmentId?: string;
    userId: string;
    parentId?: string;
    content: string;
    rating: number;
    signHash?: string;
}
