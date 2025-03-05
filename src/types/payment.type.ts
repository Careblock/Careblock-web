import { PAYMENT_STATUS } from '@/enums/Payment';

export interface Payments {
    id?: string;
    appointmentId: string;
    paymentMethodId: number;
    name?: string;
    status: PAYMENT_STATUS;
    total?: number;
    paidHash?: string;
    paidDate?: string;
    createdDate?: string;
    modifiedDate?: string;
}
