import { formatString } from '@/utils/string.helper';
import Resource from '@/constants/resource.const';
import * as Yup from 'yup';
import { createValidation } from './common.validation';

export const medicinesSchema = createValidation({
    name: Yup.string()
        .transform((value) => value.trim())
        .required(formatString(Resource.validation.required, 'Medicine name'))
        .min(1, formatString(Resource.validation.invalid, 'Medicine name')),
});

export const medicineTypesSchema = createValidation({
    name: Yup.string().required(formatString(Resource.validation.required, 'Medicine type name')),
});

export const medicinesAdminSchema = createValidation({
    name: Yup.string()
        .transform((value) => value.trim())
        .required(formatString(Resource.validation.required, 'Medicine name'))
        .min(1, formatString(Resource.validation.invalid, 'Medicine name')),
    medicineTypeId: Yup.string().required(formatString(Resource.validation.required, 'Medicine Type')),
    price: Yup.string().required(formatString(Resource.validation.required, 'Price')),
    unitPrice: Yup.string().required(formatString(Resource.validation.required, 'Unit Price')),
});
