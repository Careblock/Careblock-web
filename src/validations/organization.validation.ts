import { formatString } from '@/utils/string.helper';
import Resource from '@/constants/resource.const';
import * as Yup from 'yup';
import { createValidation } from './common.validation';

export const organizationSchema = createValidation({
    name: Yup.string().required(formatString(Resource.validation.required, 'Organization name')),
    city: Yup.string().required(formatString(Resource.validation.required, 'City')),
    district: Yup.string().required(formatString(Resource.validation.required, 'District')),
    address: Yup.string().required(formatString(Resource.validation.required, 'Address')),
    mapUrl: Yup.string().required(formatString(Resource.validation.required, 'Map URL')),
    tel: Yup.string().required(formatString(Resource.validation.required, 'Tel')),
    website: Yup.string().required(formatString(Resource.validation.required, 'Website')),
    fax: Yup.string().required(formatString(Resource.validation.required, 'Fax')),
});
