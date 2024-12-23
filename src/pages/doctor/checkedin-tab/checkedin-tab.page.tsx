import { CheckedinTabType } from './checkedin-tab.type';
import BasePatientQueue from '../base-patient-queue.component';
import { ScheduleTabs } from '@/enums/Common';
import { Images } from '@/assets/images';
import { useState } from 'react';

const CheckedinTab = ({ patients, handleClickItem }: CheckedinTabType) => {
    const [activeAppointment, setActiveAppointment] = useState<string>();

    const handleClickCheckedinItem = (id: string, appointmentId?: string) => {
        setActiveAppointment(appointmentId);
        if (handleClickItem && activeAppointment !== appointmentId) handleClickItem(id, appointmentId);
    };

    return (
        <div>
            {patients?.length ? (
                <div className="patients mb-3">
                    {patients.map((data, index) => (
                        <BasePatientQueue
                            key={data.appointmentId}
                            no={index + 1}
                            patient={data}
                            className={`${activeAppointment === data.appointmentId ? 'bg-[#f5f5f5]' : ''}`}
                            handleClickItem={($event: any) => {
                                handleClickCheckedinItem($event, data.appointmentId);
                            }}
                            scheduleTab={ScheduleTabs.CHECKEDIN}
                            handleClickPositiveIcon={() => {}}
                            handleClickNegativeIcon={() => {}}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center flex-col select-none">
                    <img className="w-[100px] h-auto grayscale mt-2" src={Images.NoData} alt="No data to display" />
                    <div className="nodata-text text-[18px]">Checkedin Patients</div>
                    <div className="description text-[14px] text-center">
                        Patients that are checked in are replaced here.
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckedinTab;
