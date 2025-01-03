import { SyntheticEvent, useEffect, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import { DoctorScheduleTab, doctorScheduleTabs } from './doctor-schedule.const';
import CheckedinTab from '../checkedin-tab/checkedin-tab.page';
import PostponedTab from '../postponed-tab/postponed-tab.page';
import DetailsInfo from '../details-info/details-info.page';
import ActiveTab from '../active-tab/active-tab.page';
import { APPOINTMENT_STATUS } from '@/enums/Appointment';
import { useAuth } from '@/contexts/auth.context';
import AppointmentService from '@/services/appointment.service';
import AccountService from '@/services/account.service';
import useObservable from '@/hooks/use-observable.hook';
import { AuthContextType } from '@/types/auth.type';
import { Patients } from '@/types/patient.type';
import { ScheduleTabs } from '@/enums/Common';
import { Images } from '@/assets/images';
import { setTitle } from '@/utils/document';

const DoctorSchedulePage = () => {
    const { userData } = useAuth() as AuthContextType;
    const { subscribeOnce } = useObservable();
    const [currentTab, setCurrentTab] = useState(ScheduleTabs.ACTIVE);
    const [schedules, setSchedules] = useState<DoctorScheduleTab[]>(doctorScheduleTabs);
    const [activePatients, setActivePatients] = useState<Patients[] | undefined>([]);
    const [postponedPatients, setPostponedPatients] = useState<Patients[] | undefined>([]);
    const [checkedinPatients, setCheckedinPatients] = useState<Patients[] | undefined>([]);
    const [detailsInfo, setDetailsInfo] = useState<Patients | undefined>();

    useEffect(() => {
        setTitle('Doctor schedule | CareBlock');
        getDataSource();
    }, []);

    useEffect(() => {
        setDetailsInfo(undefined);
    }, [currentTab]);

    function getDataSource() {
        if (userData) {
            let activeData: Patients[], postponedData: Patients[], checkedinData: Patients[];
            // Active
            subscribeOnce(
                AccountService.getScheduledPatient(userData.id, APPOINTMENT_STATUS.ACTIVE),
                (res: Patients[]) => {
                    setActivePatients(res);
                    activeData = [...res];
                }
            );
            // Postponed
            subscribeOnce(
                AccountService.getScheduledPatient(userData.id, APPOINTMENT_STATUS.POSTPONED),
                (res: Patients[]) => {
                    setPostponedPatients(res);
                    postponedData = [...res];
                }
            );
            // Checkedin
            subscribeOnce(
                AccountService.getScheduledPatient(userData.id, APPOINTMENT_STATUS.CHECKEDIN),
                (res: Patients[]) => {
                    setCheckedinPatients(res);
                    checkedinData = [...res];
                }
            );
            setTimeout(() => {
                handleSetSchedules(activeData?.length ?? 0, postponedData?.length ?? 0, checkedinData?.length ?? 0);
            }, 1000);
        }
    }

    const handleChange = (_: SyntheticEvent, newValue: ScheduleTabs) => {
        setCurrentTab(newValue);
    };

    function handleSetSchedules(activeNumber: number, postponedNumber: number, checkedinNumber: number) {
        setSchedules([
            { name: `Active (${activeNumber})`, value: ScheduleTabs.ACTIVE },
            { name: `Postponed (${postponedNumber})`, value: ScheduleTabs.POSTPONED },
            { name: `Checked in (${checkedinNumber})`, value: ScheduleTabs.CHECKEDIN },
        ]);
    }

    const handleClickPostpone = (patient: Patients) => {
        handleSetSchedules(activePatients ? activePatients.length - 1 : 0, postponedPatients!.length + 1, 0);
        let temp = activePatients?.filter((data) => data.id !== patient.id);
        setActivePatients(temp);
        if (postponedPatients) setPostponedPatients([...postponedPatients, patient]);
        else setPostponedPatients([patient]);
        if (!patient.appointmentId) return;
        subscribeOnce(
            AppointmentService.updateStatus(APPOINTMENT_STATUS.POSTPONED, patient.appointmentId),
            (_: boolean) => {
                getDataSource();
            }
        );
    };

    const handleClickBringBack = (patient: Patients) => {
        if (postponedPatients) {
            handleSetSchedules(activePatients ? activePatients.length + 1 : 1, postponedPatients.length - 1, 0);
            let temp = postponedPatients.filter((data) => data.id !== patient.id);
            setPostponedPatients(temp);
            if (activePatients) setActivePatients([...activePatients, patient]);
            else setActivePatients([patient]);
            if (!patient.appointmentId) return;
            subscribeOnce(
                AppointmentService.updateStatus(APPOINTMENT_STATUS.ACTIVE, patient.appointmentId),
                (_: boolean) => {
                    getDataSource();
                }
            );
        }
    };

    const handleClickCancel = (patient: Patients) => {
        if (activePatients?.includes(patient)) {
            handleSetSchedules(
                activePatients ? activePatients.length - 1 : 0,
                postponedPatients ? postponedPatients.length : 0,
                0
            );
            let temp = activePatients.filter((data) => data.id !== patient.id);
            setActivePatients(temp);
        } else {
            handleSetSchedules(activePatients ? activePatients.length : 0, postponedPatients!.length - 1, 0);
            let temp = postponedPatients?.filter((data) => data.id !== patient.id);
            setPostponedPatients(temp);
        }
        if (!patient.appointmentId) return;
        subscribeOnce(
            AppointmentService.updateStatus(APPOINTMENT_STATUS.REJECTED, patient.appointmentId),
            (_: boolean) => {
                getDataSource();
            }
        );
    };

    const handleClickSave = () => {
        setTimeout(() => {
            getDataSource();
            setDetailsInfo(undefined);
        }, 500);
    };

    const handleClickItem = (id: string, appointmentId: string) => {
        if (!id) return;
        subscribeOnce(AccountService.getById(id), (res: any) => {
            setDetailsInfo({
                ...res,
                appointmentId,
            });
        });
    };

    return (
        <div className="doctor-schedule h-[calc(100vh-52px-44px-30px)] overflow-hidden">
            <div className="text-[20px] leading-[20px] font-bold">Queues</div>
            <div className="text-[14px] mb-[10px]">Manage which queues you will assign to your patients</div>
            <div className="flex w-full justify-between h-[calc(100%-20px-31px)]">
                <div className="w-[400px] overflow-y-auto max-h-full border border-solid rounded-lg border-[#ddd] mr-5 overflow-auto">
                    <TabContext value={currentTab}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                {schedules.map((tab) => (
                                    <Tab key={tab.value} label={tab.name} value={tab.value} />
                                ))}
                            </TabList>
                        </Box>
                        <TabPanel value={ScheduleTabs.ACTIVE}>
                            <ActiveTab
                                activePatients={activePatients}
                                handleClickItem={handleClickItem}
                                handleClickPostpone={handleClickPostpone}
                                handleClickCancel={handleClickCancel}
                            />
                        </TabPanel>
                        <TabPanel value={ScheduleTabs.POSTPONED}>
                            <PostponedTab
                                patients={postponedPatients}
                                handleClickBringBack={handleClickBringBack}
                                handleClickCancel={handleClickCancel}
                            />
                        </TabPanel>
                        <TabPanel value={ScheduleTabs.CHECKEDIN}>
                            <CheckedinTab handleClickItem={handleClickItem} patients={checkedinPatients} />
                        </TabPanel>
                    </TabContext>
                </div>
                <div className="flex-1 h-full">
                    {detailsInfo ? (
                        <DetailsInfo currentTab={currentTab} dataSource={detailsInfo} clickedSave={handleClickSave} />
                    ) : (
                        <div className="empty-schedule overflow-hidden h-full">
                            <img className="w-full object-cover grayscale h-full" src={Images.PatientWaiting} alt="" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorSchedulePage;
