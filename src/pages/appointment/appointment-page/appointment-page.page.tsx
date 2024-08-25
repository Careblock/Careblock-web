import FirstStep from '../first-step/first-step.page';
import { useEffect, useRef, useState } from 'react';
import SecondStep from '../second-step/second-step.page';
import FinalStep from '../final-step/final-step.page';
import { ExposeData } from '../second-step/second-step.type';
import useObservable from '@/hooks/use-observable.hook';
import { useAuth } from '@/contexts/auth.context';
import Steps from '@/components/base/steps/steps.component';
import { StepType } from '@/components/base/steps/steps.type';
import { AuthContextType } from '@/types/auth.type';
import { PATHS } from '@/enums/RoutePath';
import { Box, Button, Dialog, DialogTitle, List, ListItem, Modal, Typography } from '@mui/material';
import { style } from './appointment-page.const';
import { Login } from '@/pages/authentication/login/login.page';
import { ROLE_NAMES } from '@/enums/Common';
import { ExaminationTypes } from '@/types/examinationType.type';
import { Organizations } from '@/types/organization.type';
import AccountService from '@/services/account.service';
import { Accounts } from '@/types/account.type';

const steps: StepType[] = [
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

const AppointmentPage = () => {
    const finalStepRef = useRef<any>(null);
    const { subscribeOnce } = useObservable();
    const [extraData, setExtraData] = useState<any>();
    const { userData } = useAuth() as AuthContextType;
    const [activeStep, setActiveStep] = useState(0);
    const [isNext, setIsNext] = useState<boolean>(false);
    const [examinationType, setExaminationType] = useState<ExaminationTypes | undefined>();
    const [isShowConfirmPopup, setIsShowConfirmPopup] = useState(false);
    const [isShowLoginPopup, setIsShowLoginPopup] = useState(false);
    const [scheduleData, setScheduleData] = useState<ExposeData>({
        examinationPackage: undefined,
        date: null,
        time: '',
    });

    useEffect(() => {
        subscribeOnce(AccountService.getById(userData?.id), (res: Accounts) => {
            if (res) {
                setExtraData(res);
            }
        });
    }, []);

    useEffect(() => {
        if (activeStep === steps[2].id) setIsNext(true);
        handleChangePath(activeStep + 1);
    }, [activeStep]);

    useEffect(() => {
        if (scheduleData.examinationPackage && scheduleData.date) setIsNext(true);
    }, [scheduleData]);

    useEffect(() => {
        if (examinationType?.id) setIsNext(true);
    }, [examinationType]);

    const handleChangeStep = (step: number) => {
        if (step !== steps[2].id + 1) setActiveStep(step);
    };

    const toggleIsShowConfirm = (type: boolean) => setIsShowConfirmPopup(type);

    const handleClickFinished = () => {
        if (userData && userData.role == ROLE_NAMES.PATIENT) {
            finalStepRef.current!.onSubmitForm();
        } else toggleIsShowConfirm(true);
    };

    const handleCancelPopup = () => {
        toggleIsShowConfirm(false);
        setActiveStep(activeStep - 1);
    };

    const handleChoseExaminationType = (type: ExaminationTypes) => {
        setExaminationType(type);
    };

    const handleChangeSchedule = (schedule: ExposeData) => {
        setScheduleData(schedule);
    };

    const handleChangeExtraData = (newValue: string) => {
        setExtraData(newValue);
    };

    const handleClickNextOrBack = (isNextStep: boolean = !isNext) => {
        if (activeStep === steps[0].id && scheduleData.examinationPackage !== undefined) isNextStep = true;
        if (activeStep !== steps[2].id) setIsNext(isNextStep);
    };

    const handleChangePath = (step: number) => {
        switch (step) {
            case 1:
                window.history.replaceState(null, `Step 1 | Careblock`, PATHS.APPOINTMENT_STEP1);
                break;
            case 2:
                window.history.replaceState(null, `Step 2 | Careblock`, PATHS.APPOINTMENT_STEP2);
                break;
            case 3:
                window.history.replaceState(null, `Step 3 | Careblock`, PATHS.APPOINTMENT_STEP3);
                break;
        }
    };

    function LoginDialog(_: any) {
        return (
            <Dialog className="bg-blue-gray-300" open={isShowLoginPopup} onClose={() => setIsShowLoginPopup(false)}>
                <DialogTitle></DialogTitle>
                <List style={{ width: '500px', height: '300px' }} className="rounded-xl">
                    <ListItem>
                        <Login handleClose={() => setIsShowLoginPopup(false)} />
                    </ListItem>
                </List>
            </Dialog>
        );
    }

    const getOrganizationInfor = () => {
        const orgInfor = {
            id: scheduleData.examinationPackage?.organizationId,
            name: scheduleData.examinationPackage?.organizationName,
            address: scheduleData.examinationPackage?.organizationLocation,
        } as Organizations;
        return orgInfor;
    };

    return (
        <>
            <div className="appointment-container pt-[10px] pb-[20px] text-sm">
                <div className="appointment-first__heading">
                    <Steps
                        steps={steps}
                        isNext={isNext}
                        activeStep={activeStep}
                        finalText="Confirm"
                        alwaysShowFinaLText={true}
                        setActiveStep={handleChangeStep}
                        onClickNextOrBack={handleClickNextOrBack}
                        onClickFinished={handleClickFinished}
                    />
                </div>
                <div className="appointment-first__content">
                    {activeStep === steps[0].id ? (
                        <FirstStep
                            examinationType={examinationType}
                            onClickAnExaminationType={handleChoseExaminationType}
                        />
                    ) : activeStep === steps[1].id ? (
                        <SecondStep
                            scheduleData={scheduleData}
                            setScheduleData={handleChangeSchedule}
                            examinationType={examinationType}
                        />
                    ) : (
                        <FinalStep
                            ref={finalStepRef}
                            userData={userData}
                            extraData={extraData}
                            setExtraData={handleChangeExtraData}
                            schedule={scheduleData}
                            organization={getOrganizationInfor()}
                        />
                    )}
                </div>
            </div>
            {/* Login popup */}
            <LoginDialog open={isShowLoginPopup} onClose={() => setIsShowLoginPopup(false)} />
            {/* Popup confirm */}
            <Modal
                open={isShowConfirmPopup}
                onClose={() => toggleIsShowConfirm(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Warning
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Login as a patient to make a reservation!
                    </Typography>
                    <div className="flex items-center justify-end space-x-5 mt-7">
                        <Button variant="contained" color="inherit" onClick={() => handleCancelPopup()}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => setIsShowLoginPopup(true)}>
                            Move to login
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    );
};

export default AppointmentPage;
