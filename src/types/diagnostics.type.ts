import { DIAGNOSTIC_STATUS } from '@/enums/Common';

export interface Diagnostics {
    id: string;
    doctorId: string;
    patientId: string;
    disease?: string;
    time?: string;
    weight?: number;
    height?: number;
    heartRate?: number;
    bodyTemperature?: number;
    diastolicBloodPressure?: number;
    systolicBloodPressure?: number;
    note?: string;
    status: DIAGNOSTIC_STATUS;
}
