import { ExaminationPackages } from '@/types/examinationPackage.type';
import { ExaminationTypes } from '@/types/examinationType.type';

export const INITIAL_EXAMINATION_PACKAGES_VALUES = {
    INFORMATION: {
        name: '',
        thumbnail: '',
        organizationId: '',
    } as ExaminationPackages,
};

export const INITIAL_EXAMINATION_TYPES_VALUES = {
    INFORMATION: {
        name: '',
        thumbnail: '',
    } as ExaminationTypes,
};
