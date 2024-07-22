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

    const handleClickFinished = () => {
        let { startDate, endDate } = convertSeparateToDateTime(scheduleData);
        if (userData) {
            subscribeOnce(
                AppointmentService.insert({
                    doctorId: scheduleData.doctor!.id,
                    patientId: userData.id,
                    status: APPOINTMENT_STATUS.ACTIVE,
                    note: '',
                    reason: reason,
                    startTime: startDate,
                    endTime: endDate,
                } as Appointments),
                (res: any) => {
                    addToast({ text: SystemMessage.MAKE_AN_APPOINTMENT_SUCCESS, position: 'top-right' });
                    res && navigate(PATHS.HOME);
                }
            );
        }
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

    return (
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
    );
};

export default AppointmentPage;
