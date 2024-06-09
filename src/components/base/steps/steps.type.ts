export interface StepProps {
    steps: StepType[];
    isNext: boolean;
    stepOptional?: number;
    enabledReset?: boolean;
    isShowDescription?: boolean;
    activeStep?: number;
    finalText?: string;
    setActiveStep: Function;
    onClickFinished: Function;
    onClickNextOrBack: Function;
}

export interface StepType {
    id: number;
    text: string;
}
