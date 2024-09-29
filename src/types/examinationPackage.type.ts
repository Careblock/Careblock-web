export interface ExaminationPackages {
    id?: string;
    organizationId?: string;
    examinationTypeId?: number | string;
    name: string;
    thumbnail?: string;
    createdDate: number;
    modifiedDate: number;
    isDeleted: boolean;
}
