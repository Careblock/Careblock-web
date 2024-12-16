import { formatString } from '@/utils/string.helper';
import Resource from '@/constants/resource.const';
import * as Yup from 'yup';
import { createValidation } from './common.validation';

export const specialistsSchema = createValidation({
    name: Yup.string().required(formatString(Resource.validation.required, 'Specialist name')),
});

export const editSpecialistsSchema = createValidation({
    name: Yup.string().required(formatString(Resource.validation.required, 'Specialst name')),
    organizationId: Yup.string().required(formatString(Resource.validation.required, 'Organization')),
});
