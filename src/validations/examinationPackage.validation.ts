import { formatString } from '@/utils/string.helper';
import Resource from '@/constants/resource.const';
import * as Yup from 'yup';
import { createValidation } from './common.validation';

export const examinationPackagesSchema = createValidation({
    name: Yup.string().required(formatString(Resource.validation.required, 'Examination package name')),
});

export const editExaminationPackagesSchema = createValidation({
    name: Yup.string().required(formatString(Resource.validation.required, 'Examination package name')),
    organizationId: Yup.string().required(formatString(Resource.validation.required, 'Organization')),
});

export const editExaminationPackagesAdminSchema = createValidation({
    name: Yup.string().required(formatString(Resource.validation.required, 'Examination package name')),
    organizationId: Yup.string().required(formatString(Resource.validation.required, 'Organization')),
    examinationTypeId: Yup.string().required(formatString(Resource.validation.required, 'Examination Type')),
});

export const examinationTypesSchema = createValidation({
    name: Yup.string().required(formatString(Resource.validation.required, 'Examination type name')),
});
