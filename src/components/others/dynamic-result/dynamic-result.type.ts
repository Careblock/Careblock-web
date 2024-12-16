import { FormType } from '@/enums/FormType';
import { DynamicFieldType } from '@/types/dynamic-field.type';

export interface Props {
    type: FormType;
    classes?: string;
    datasource: DynamicFieldType[];
    setDataSubmit: Function;
}
