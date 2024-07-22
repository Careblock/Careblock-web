import BasePatientQueue from '../base-patient-queue.component';
import { PostponedTabType } from './postponed-tab.type';
import { ScheduleTabs } from '@/enums/Common';
import { Images } from '@/assets/images';

const PostponedTab = ({ patients, handleClickBringBack, handleClickCancel }: PostponedTabType) => {
    return (
        <div>
            {patients?.length ? (
                <div className="patients mb-3">
                    {patients.map((data, index) => (
                        <BasePatientQueue
                            key={data.id}
                            no={index + 1}
                            patient={data}
                            handleClickItem={null}
                            scheduleTab={ScheduleTabs.POSTPONED}
                            handleClickPositiveIcon={handleClickBringBack}
                            handleClickNegativeIcon={handleClickCancel}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center flex-col select-none">
                    <img className="w-[100px] h-auto grayscale mt-2" src={Images.NoData} alt="No data to display" />
                    <div className="nodata-text text-[18px]">Postponed Patients</div>
                    <div className="description text-[14px] text-center">
                        Patients that are temporarily from the queue are replaced here.
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostponedTab;
