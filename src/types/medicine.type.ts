export interface Medicines {
    id: string;
    medicineTypeId: string;
    name: string;
    price: number;
    unitPrice: number;
    description?: string;
    thumbnail?: string;
    createdDate?: string;
    modifiedDate?: string;
    isDeleted?: boolean;
}
