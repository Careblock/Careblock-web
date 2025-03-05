import { Bill } from '@/types/result.type';

export interface BillProps {
    visible: boolean;
    bill?: Bill;
    setVisible: Function;
    appointmentId?: string;
}
