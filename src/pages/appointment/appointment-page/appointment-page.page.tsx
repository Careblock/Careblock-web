import FirstStep from '../first-step/first-step.page';
import { useEffect, useState } from 'react';
import SecondStep from '../second-step/second-step.page';
import FinalStep from '../final-step/final-step.page';
import { ExposeData } from '../second-step/second-step.type';
import { useNavigate } from 'react-router-dom';
import useObservable from '@/hooks/use-observable.hook';
import { useAuth } from '@/contexts/auth.context';
import Steps from '@/components/base/steps/steps.component';
import { StepType } from '@/components/base/steps/steps.type';
import { Organizations } from '@/types/organization.type';
import { AuthContextType } from '@/types/auth.type';
import { convertSeparateToDateTime } from '@/utils/datetime.helper';
import AppointmentService from '@/services/appointment.service';
import { APPOINTMENT_STATUS } from '@/enums/Appointment';
import { Appointments } from '@/types/appointment.type';
import { addToast } from '@/components/base/toast/toast.service';
import { SystemMessage } from '@/constants/message.const';
import { PATHS } from '@/enums/RoutePath';
import { Box, Button, Dialog, DialogTitle, List, ListItem, Modal, Typography } from '@mui/material';
import { style } from './appointment-page.const';
import { Login } from '@/pages/authentication/login/login.page';
import { ROLES } from '@/enums/Common';

const steps: StepType[] = [
    {
        id: 0,
        text: `1. Choose a medical facility`,
    },
    {
        id: 1,
        text: `2. Choose a doctor`,
    },
    {
        id: 2,
        text: `3. Confirm your information`,
    },
];

const AppointmentPage = () => {
    const navigate = useNavigate();
    const { subscribeOnce } = useObservable();
    const [reason, setReason] = useState('');
    const { userData } = useAuth() as AuthContextType;
    const [activeStep, setActiveStep] = useState(0);
    const [isNext, setIsNext] = useState<boolean>(false);
    const [organization, setOrganization] = useState<Organizations | undefined>();
    const [isShowConfirmPopup, setIsShowConfirmPopup] = useState(false);
    const [isShowLoginPopup, setIsShowLoginPopup] = useState(false);
    const [scheduleData, setScheduleData] = useState<ExposeData>({
        doctor: undefined,
        date: null,
        time: '',
        price: 0,
    });

    useEffect(() => {
        if (activeStep === steps[2].id) setIsNext(true);
        handleChangePath(activeStep + 1);
    }, [activeStep]);

    useEffect(() => {
        if (scheduleData.doctor && scheduleData.date) setIsNext(true);
    }, [scheduleData]);

    useEffect(() => {
        if (organization?.id) setIsNext(true);
    }, [organization]);

    const handleChangeStep = (step: number) => {
        setActiveStep(step);
    };

    const toggleIsShowConfirm = (type: boolean) => setIsShowConfirmPopup(type);

    const insertAppoinment = () => {
        // let { startDate, endDate } = convertSeparateToDateTime(scheduleData);
        if (userData) {
            // Update api insert appointment
            // subscribeOnce(
            //     AppointmentService.insert({
            //         doctorId: scheduleData.doctor!.id,
            //         patientId: userData.id,
            //         status: APPOINTMENT_STATUS.ACTIVE,
            //         note: '',
            //         reason: reason,
            //         startTime: startDate,
            //         endTime: endDate,
            //     } as Appointments),
            //     (res: any) => {
            //         addToast({ text: SystemMessage.MAKE_AN_APPOINTMENT_SUCCESS, position: 'top-right' });
            //         setTimeout(() => {
            //             res && navigate(PATHS.HOME);
            //         }, 100);
            //     }
            // );
        }
    };

    const handleClickFinished = () => {
        if (userData && userData.role == ROLES.PATIENT) insertAppoinment();
        else toggleIsShowConfirm(true);
    };

    const handleCancelPopup = () => {
        toggleIsShowConfirm(false);
        setActiveStep(activeStep - 1);
    };

    const handleChoseOrganization = (org: Organizations) => {
        setOrganization(org);
    };

    const handleChangeSchedule = (schedule: ExposeData) => {
        setScheduleData(schedule);
    };

    const handleChangeReason = (newValue: string) => {
        setReason(newValue);
    };

    const handleClickNextOrBack = (isNextStep: boolean = !isNext) => {
        if (activeStep === steps[0].id && scheduleData.doctor !== undefined) isNextStep = true;
        setIsNext(isNextStep);
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

    return (
        <>
            <div className="appointment-container pt-[10px] pb-[20px] text-sm">
                <div className="appointment-first__heading">
                    <Steps
                        steps={steps}
                        isNext={isNext}
                        activeStep={activeStep}
                        finalText="Confirm"
                        setActiveStep={handleChangeStep}
                        onClickNextOrBack={handleClickNextOrBack}
                        onClickFinished={handleClickFinished}
                    />
                </div>
                <div className="appointment-first__content">
                    {activeStep === steps[0].id ? (
                        <FirstStep organization={organization} onClickAnOrganization={handleChoseOrganization} />
                    ) : activeStep === steps[1].id ? (
                        <SecondStep
                            scheduleData={scheduleData}
                            setScheduleData={handleChangeSchedule}
                            organization={organization}
                        />
                    ) : (
                        <FinalStep
                            reason={reason}
                            setReason={handleChangeReason}
                            organization={organization}
                            schedule={scheduleData}
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
