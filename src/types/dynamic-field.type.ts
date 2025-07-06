import { FieldType } from '@/enums/FieldType';

export interface DynamicFieldType {
    type: FieldType;
    fieldName: string;
    value: any;
    displayValue?: any;
    colspan?: number;
    rowspan?: number;
    rowIndex: number;
    placeholder?: string;
    caption?: string;
    defaultValue?: any;
    style?: string;
    images?: string[];
    alignment?: AlignmentType;
    isDefault: boolean;
    isGroup?: boolean;
    isCustomField?: boolean;
    disabled?: boolean;
}

export type AlignmentType = 'left' | 'right' | 'center' | 'between' | undefined;
