export interface SelectBoxType {
    label: string;
    id: string;
    inputId: string;
    modelValue: string;
    updateModelValue: Function;
    dataSource: {
        id: string | number;
        value: string;
    }[];
}
