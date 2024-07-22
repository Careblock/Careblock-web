export interface Medicines {
    id: string;
    organizationId: string;
    name: string;
    price: number;
    note?: string;
    avatar?: string;
    isDeleted: number;
    createdBy?: string;
    modifiedBy?: string;
    createdDate?: string;
    modifiedDate?: string;
}
