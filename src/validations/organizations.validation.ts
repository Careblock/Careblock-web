import { formatString } from '@/utils/string.helper';
import Resource from '@/constants/resource.const';
import * as Yup from 'yup';
import { createValidation } from './common.validation';

export const organizationsSchema = createValidation({
    name: Yup.string().required(formatString(Resource.validation.required, 'Name')),
    city: Yup.string().required(formatString(Resource.validation.required, 'City')),
    district: Yup.string().required(formatString(Resource.validation.required, 'District')),
    address: Yup.string().required(formatString(Resource.validation.required, 'Address')),
});
