import { formatString } from '@/utils/string.helper';
import Resource from '@/constants/resource.const';
import * as Yup from 'yup';
import { createValidation } from './common.validation';

export const examinationOptionsSchema = createValidation({
    name: Yup.string().required(formatString(Resource.validation.required, "Examination option's name")),
    specialistId: Yup.string().required(formatString(Resource.validation.required, 'Specialist')),
    price: Yup.number().required(formatString(Resource.validation.required, 'Price')),
    timeEstimation: Yup.number().required(formatString(Resource.validation.required, 'Time Estimation')),
});
