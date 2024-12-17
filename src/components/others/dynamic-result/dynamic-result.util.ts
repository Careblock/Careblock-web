import { FieldType } from '@/enums/FieldType';
import { AlignmentType } from '@/types/dynamic-field.type';

export const getAlignmentStyle = (alignment: AlignmentType) => {
    switch (alignment) {
        case 'left':
            return 'justify-start';
        case 'center':
            return 'justify-center';
        case 'right':
            return 'justify-end';
        case 'between':
            return 'justify-between';
        default:
            return '';
    }
};

export const isDynamicField = (type: FieldType) =>
    type === FieldType.DateBox ||
    type === FieldType.Input ||
    type === FieldType.SelectBox ||
    type === FieldType.TextArea;
