export interface MedicalServices {
    id: string;
    organizationId: string;
    name: string;
    price: number;
    note?: string;
    avatar?: string;
    isDeleted: number;
}
