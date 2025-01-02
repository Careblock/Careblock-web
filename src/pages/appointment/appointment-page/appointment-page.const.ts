import { StepType } from '@/components/base/steps/steps.type';

export const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingTop: 3,
    paddingLeft: 3,
    paddingRight: 3,
    paddingBottom: 4,
    borderRadius: 4,
};

export const steps: StepType[] = [
    {
        id: 0,
        text: `Choose a medical service`,
    },
    {
        id: 1,
        text: `Choose an examination package`,
    },
    {
        id: 2,
        text: `Confirm your information`,
    },
];
