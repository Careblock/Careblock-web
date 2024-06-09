import { createValidation } from './common.validation';
import { REGEX } from '@/constants/regex.const';
import { REF } from '@/constants/common.const';
import { formatString } from '@/utils/string.helper';
import Resource from '@/constants/resource.const';
import * as Yup from 'yup';

export const commonUserSchema = {
    firstname: Yup.string().required(formatString(Resource.validation.required, 'First name')),
    lastname: Yup.string().required(formatString(Resource.validation.required, 'Last name')),
    phone: Yup.string()
        .required(formatString(Resource.validation.required, 'Phone number'))
        .matches(REGEX.PHONE_NUMBER, formatString(Resource.validation.exactly, 'The phone number', '10')),
    dateOfBirth: Yup.string().required(formatString(Resource.validation.required, 'Date of birth')),
    gender: Yup.string().required(formatString(Resource.validation.required, 'Gender')),
    email: Yup.string()
        .required(formatString(Resource.validation.required, 'Email'))
        .matches(REGEX.EMAIL, formatString(Resource.validation.invalid, 'email')),
    identityId: Yup.string().required(formatString(Resource.validation.required, 'Identity ID')),
    bloodType: Yup.string().required(formatString(Resource.validation.required, 'Blood type')),
    role: Yup.string().required(formatString(Resource.validation.required, 'Role')),
};

export const updatePatientSchema = createValidation(commonUserSchema);

export const changeUserPasswordSchema = createValidation({
    oldPassword: Yup.string().required(formatString(Resource.validation.required, 'Old password')),
    newPassword: Yup.string()
        .required(formatString(Resource.validation.required, 'New password'))
        .min(8, formatString(Resource.validation.minLength, 'Password', '8'))
        .max(16, formatString(Resource.validation.maxLength, 'Password', '16')),
    confirmPassword: Yup.string()
        .required(formatString(Resource.validation.required, 'Confirm password'))
        .min(8, formatString(Resource.validation.minLength, 'Password', '8'))
        .max(16, formatString(Resource.validation.maxLength, 'Password', '16'))
        .oneOf([Yup.ref(REF.NEWPASSWORD)], formatString(Resource.validation.matches, 'Password')),
});
