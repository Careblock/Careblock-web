import { REGEX } from '@/constants/regex.const';
import { formatString } from '@/utils/string.helper';
import Resource from '@/constants/resource.const';
import * as Yup from 'yup';

export const appoinmentCreateSchema = {
    name: Yup.string().required(formatString(Resource.validation.required, 'Name')),
    phone: Yup.string()
        .required(formatString(Resource.validation.required, 'Phone number'))
        .matches(REGEX.PHONE_NUMBER, formatString(Resource.validation.exactly, 'The phone number', '10')),
    email: Yup.string()
        .required(formatString(Resource.validation.required, 'Email'))
        .matches(REGEX.EMAIL, formatString(Resource.validation.invalid, 'email')),
};
