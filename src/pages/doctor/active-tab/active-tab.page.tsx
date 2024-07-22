import BasePatientQueue from '../base-patient-queue.component';
import { ActiveTabType } from './active-tab.type';
import { ScheduleTabs } from '@/enums/Common';
import { Images } from '@/assets/images';

const ActiveTab = ({ activePatients, handleClickPostpone, handleClickCancel, handleClickItem }: ActiveTabType) => {
    const getListData = () => {
        if (activePatients) {
            const length = activePatients.length;
            return (
                <>
                    <div className="current-patient mb-3 pb-3">
                        <div className="text-[#4e4e4e]">Now Serving</div>
                        <BasePatientQueue
                            key={activePatients[0].id}
                            no={1}
                            patient={activePatients[0]}
                            scheduleTab={ScheduleTabs.ACTIVE}
                            handleClickItem={handleClickItem}
                            handleClickPositiveIcon={handleClickPostpone}
                            handleClickNegativeIcon={handleClickCancel}
                        />
                    </div>
                    {length > 1 && (
                        <div className="next-patients border-t-1 border-solid border-[#ddd] pt-2">
                            <div className="text-[#4e4e4e] mt-1">{`Next in Line (${length - 1})`}</div>
                            {activePatients.slice(1, length).map((data, index) => {
                                return (
                                    <BasePatientQueue
                                        key={data.appointmentId ?? index}
                                        no={index + 2}
                                        patient={data}
                                        handleClickItem={null}
                                        scheduleTab={ScheduleTabs.ACTIVE}
                                        handleClickPositiveIcon={handleClickPostpone}
                                        handleClickNegativeIcon={handleClickCancel}
                                    />
                                );
                            })}
                        </div>
                    )}
                </>
            );
        }
    };

    return (
        <div>
            {activePatients?.length ? (
                getListData()
            ) : (
                <div className="flex items-center justify-center flex-col select-none">
                    <img className="w-[100px] h-auto grayscale mt-2" src={Images.NoData} alt="No data to display" />
                    <div className="nodata-text text-[18px]">No Active Patients Today</div>
                    <div className="description text-[14px] text-center">Click "Select Patient" button to begin.</div>
                </div>
            )}
        </div>
    );
};

export default ActiveTab;
