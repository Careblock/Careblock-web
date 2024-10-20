import { StepType } from '@/components/base/steps/steps.type';

export const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 3,
};

export const steps: StepType[] = [
    {
        id: 0,
        text: `1. Choose a medical service`,
    },
    {
        id: 1,
        text: `2. Choose an examination package`,
    },
    {
        id: 2,
        text: `3. Confirm your information`,
    },
];
