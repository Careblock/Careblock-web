export interface Payments {
    id: string;
    appointmentId: string;
    paymentMethodId: number;
    name: string;
    status: string;
    total: number;
    createdDate?: string;
    modifiedDate?: string;
}
