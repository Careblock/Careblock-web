import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { StepProps } from './steps.type';

export default function Steps({
    steps,
    isNext = false,
    activeStep = 0,
    stepOptional = -1,
    enabledReset = false,
    isShowDescription = false,
    finalText,
    setActiveStep,
    onClickFinished,
    onClickNextOrBack,
}: StepProps) {
    const [skipped, setSkipped] = useState(new Set<number>());

    const isStepOptional = (step: number) => {
        return step === stepOptional - 1;
    };

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        if (activeStep === steps[steps.length - 1].id) {
            onClickFinished();
        }

        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep(activeStep + 1);
        setSkipped(newSkipped);
        onClickNextOrBack();
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
        onClickNextOrBack(true);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            alert("You can't skip a step that isn't optional.");
        }

        setActiveStep(activeStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <div className="base-step__container">
            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep}>
                    {steps.map((step) => {
                        const stepProps: { completed?: boolean } = {};
                        const labelProps: {
                            optional?: React.ReactNode;
                        } = {};
                        if (isStepOptional(step.id)) {
                            labelProps.optional = <Typography variant="caption">Optional</Typography>;
                        }
                        if (isStepSkipped(step.id)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={step.text} {...stepProps}>
                                <StepLabel {...labelProps}>{step.text}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === steps.length ? (
                    <>
                        {isShowDescription && (
                            <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you're finished</Typography>
                        )}
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            {enabledReset && <Button onClick={handleReset}>Reset</Button>}
                        </Box>
                    </>
                ) : (
                    <>
                        {isShowDescription && <Typography sx={{ mt: 2, mb: 1 }}>{`Step ${activeStep + 1}`}</Typography>}
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                                Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            {isStepOptional(activeStep) && (
                                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                    Skip
                                </Button>
                            )}
                            <Button onClick={handleNext} disabled={!isNext}>
                                {activeStep === steps.length - 1 ? (finalText ? finalText : 'Finished') : 'Next'}
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </div>
    );
}
