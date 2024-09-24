import { formatString } from '@/utils/string.helper';
import Resource from '@/constants/resource.const';
import * as Yup from 'yup';
import { createValidation } from './common.validation';

export const departmentSchema = createValidation({
    name: Yup.string().required(formatString(Resource.validation.required, 'Department name')),
});
