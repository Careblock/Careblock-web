import { DataType } from '@/enums/Common';

export interface CreateConsultationType {
    appointmentId: string;
    patientId: string;
    visible: boolean;
    setVisible: Function;
    clickedSave: Function;
}

export interface VitalsDynamicFieldType {
    id: string;
    className?: string;
    label: string;
    field: DiagnosticsFieldType;
    dataType: DataType;
}

export type DiagnosticsFieldType =
    | 'disease'
    | 'weight'
    | 'height'
    | 'heartRate'
    | 'bodyTemperature'
    | 'diastolicBloodPressure'
    | 'systolicBloodPressure'
    | 'note'
    | 'status';
