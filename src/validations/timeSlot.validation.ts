import { formatString } from '@/utils/string.helper';
import Resource from '@/constants/resource.const';
import * as Yup from 'yup';
import { createValidation } from './common.validation';

export const timeSlotSchema = createValidation({
    examinationPackageId: Yup.string().required(formatString(Resource.validation.required, 'Examination Package')),
    startTime: Yup.mixed().required(formatString(Resource.validation.required, 'Start Time')),
    endTime: Yup.mixed().required(formatString(Resource.validation.required, 'End Time')),
    period: Yup.number().required(formatString(Resource.validation.required, 'Period')),
});
