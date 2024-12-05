export interface Medicines {
    id: string;
    medicineTypeId: string;
    medicineTypeName: string;
    name: string;
    price: number;
    unitPrice: number;
    unitPriceName?: string;
    description?: string;
    thumbnail?: string;
    createdDate?: string;
    modifiedDate?: string;
    isDeleted?: boolean;
}
