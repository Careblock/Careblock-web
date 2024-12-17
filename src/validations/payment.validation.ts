import { formatString } from '@/utils/string.helper';
import Resource from '@/constants/resource.const';
import * as Yup from 'yup';
import { createValidation } from './common.validation';

export const paymentMethodSchema = createValidation({
    name: Yup.string().required(formatString(Resource.validation.required, 'Payment method name')),
});
