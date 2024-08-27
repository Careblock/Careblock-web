import { displayStandardDateTime, formatStandardDate } from '@/utils/datetime.helper';
import { BasePatientType } from './base-patient.type';
import { getFullName } from '@/utils/common.helpers';
import { ScheduleTabs } from '@/enums/Common';
import { Images } from '@/assets/images';

const BasePatientQueue = ({
    patient,
    no,
    handleClickPositiveIcon,
    handleClickNegativeIcon,
    scheduleTab,
    handleClickItem,
}: BasePatientType) => {
    const getGenderAndDOB = () => {
        if (patient.gender && patient.dateOfBirth)
            return `${patient.gender} - ${formatStandardDate(new Date(patient.dateOfBirth))}`;
        if (patient.gender) return patient.gender;
        if (patient.dateOfBirth) return formatStandardDate(new Date(patient.dateOfBirth));
    };

    return (
        <div
            className={`base-patient-queue select-none hover:bg-gray p-2 rounded flex items-center justify-between first:mt-0 mt-2 group hover:bg-[#f5f5f5] ${handleClickItem !== null && handleClickItem !== undefined ? 'cursor-pointer' : ''}`}
            onClick={() => {
                if (handleClickItem !== null && handleClickItem !== undefined) {
                    handleClickItem(patient.id);
                }
            }}
        >
            <div className="flex items-center">
                <div className="left text-primary w-[30px] flex items-center justify-center mr-4 text-[18px]">{`# ${no}`}</div>
                <div className="right space-y-1 flex-1">
                    <div className="name font-bold text-[18px]">{getFullName(patient)}</div>
                    <div className="other-infor text-[#4e4e4e]">{getGenderAndDOB()}</div>
                    <div className="queue-at text-[#4e4e4e]">{`Queue at: ${displayStandardDateTime(new Date(patient.startDateExpectation!))}`}</div>
                </div>
            </div>
            {scheduleTab !== ScheduleTabs.CHECKEDIN && (
                <div className="w-[80px] items-center justify-end hidden group-hover:flex">
                    <div
                        className="mr-2"
                        title={scheduleTab === ScheduleTabs.ACTIVE ? 'Postpone' : 'Bring back'}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClickPositiveIcon(patient);
                        }}
                    >
                        {scheduleTab === ScheduleTabs.ACTIVE ? (
                            <Images.AccessTimeIcon className="cursor-pointer text-[22px] text-[orange]" />
                        ) : (
                            <Images.UndoIcon className="cursor-pointer text-[22px] text-[orange]" />
                        )}
                    </div>
                    <div
                        title="Cancel"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClickNegativeIcon(patient);
                        }}
                    >
                        <Images.NotInterestedIcon className="cursor-pointer text-[22px] text-[red]" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BasePatientQueue;
