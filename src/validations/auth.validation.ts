import { createValidation } from './common.validation';
import { commonUserSchema } from './user.validation';
import { REGEX } from '@/constants/regex.const';
import { REF } from '@/constants/common.const';
import { formatString } from '@/utils/string.helper';
import Resource from '@/constants/resource.const';
import * as Yup from 'yup';

export const registerPatientSchema = createValidation(commonUserSchema);

export const registerDoctorSchema = createValidation({
    ...commonUserSchema,
    departmentId: Yup.string().required(formatString(Resource.validation.required, 'Department')),
    organizationId: Yup.string().required(formatString(Resource.validation.required, 'Organization')),
    seniority: Yup.number()
        .typeError('Seniority must be a number')
        .required('Seniority is required')
        .min(1, 'Seniority invalid'),
});

export const forgotPasswordSchema = createValidation({
    email: Yup.string()
        .required(formatString(Resource.validation.required, 'Email'))
        .matches(REGEX.EMAIL, formatString(Resource.validation.invalid, 'email')),
});

export const changePasswordSchema = createValidation({
    newPassword: Yup.string()
        .required(formatString(Resource.validation.required, 'New password'))
        .min(8, formatString(Resource.validation.minLength, 'Password', '8'))
        .max(16, formatString(Resource.validation.maxLength, 'Password', '16')),
    confirmPassword: Yup.string()
        .required(formatString(Resource.validation.required, 'Confirm password'))
        .oneOf([Yup.ref(REF.NEWPASSWORD)], formatString(Resource.validation.matches, 'Password')),
});
