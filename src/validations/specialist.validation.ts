import { formatString } from '@/utils/string.helper';
import Resource from '@/constants/resource.const';
import * as Yup from 'yup';
import { createValidation } from './common.validation';

export const specialistsSchema = createValidation({
    name: Yup.string()
    .transform((value) => value.trim())
    .required(formatString(Resource.validation.required, 'Specialist name'))
    .min(1, formatString(Resource.validation.invalid, 'Specialist name')),
});

export const editSpecialistsSchema = createValidation({
    name: Yup.string()
    .transform((value) => value.trim())
    .required(formatString(Resource.validation.required, 'Specialist name'))
    .min(1, formatString(Resource.validation.invalid, 'Specialist name')),
    organizationId: Yup.string().required(formatString(Resource.validation.required, 'Organization')),
});
