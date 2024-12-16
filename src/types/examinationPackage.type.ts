export interface ExaminationPackages {
    id?: string;
    organizationId?: string;
    organizationName?: string;
    examinationTypeId?: number | string;
    examinationTypeName?: string;
    name: string;
    thumbnail?: string;
    createdDate: number;
    modifiedDate: number;
    isDeleted: boolean;
}
