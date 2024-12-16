import { DIAGNOSTIC_STATUS, DataType } from '@/enums/Common';
import { VitalsDynamicFieldType } from './create-consultation.type';

export const selectDiagnosticOptions = [
    {
        id: DIAGNOSTIC_STATUS.HEALTHY,
        value: 'Healthy',
    },
    {
        id: DIAGNOSTIC_STATUS.UNHEALTHY,
        value: 'Unhealthy',
    },
    {
        id: DIAGNOSTIC_STATUS.CRITICAL,
        value: 'Critical',
    },
    {
        id: DIAGNOSTIC_STATUS.NORMAL,
        value: 'Normal',
    },
    {
        id: DIAGNOSTIC_STATUS.PATHOLOGICAL,
        value: 'Pathological',
    },
];

export const vitalsDynamicField: VitalsDynamicFieldType[] = [
    {
        id: 'disease-field',
        label: 'Disease',
        className: 'w-[48%]',
        field: 'disease',
        dataType: DataType.string,
    },
    {
        id: 'height-field',
        label: 'Height',
        className: 'w-[48%]',
        field: 'height',
        dataType: DataType.number,
    },
    {
        id: 'weight-field',
        label: 'Weight',
        className: 'w-[48%]',
        field: 'weight',
        dataType: DataType.number,
    },
    {
        id: 'heartRate-field',
        label: 'Heart Rate',
        className: 'w-[48%]',
        field: 'heartRate',
        dataType: DataType.number,
    },
    {
        id: 'bodyTemperature-field',
        label: 'Body Temperature',
        className: 'w-[48%]',
        field: 'bodyTemperature',
        dataType: DataType.number,
    },
    {
        id: 'diastolicBloodPressure-field',
        label: 'Diastolic Blood Pressure',
        className: 'w-[48%]',
        field: 'diastolicBloodPressure',
        dataType: DataType.number,
    },
    {
        id: 'systolicBloodPressure-field',
        label: 'Systolic Blood Pressure',
        className: 'w-[48%]',
        field: 'systolicBloodPressure',
        dataType: DataType.number,
    },
];
