import { displayStandardDateTime } from '@/utils/datetime.helper';
import { BasePatientType } from './base-patient.type';
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
    const handleClickWrapper = () => {
        if (handleClickItem !== null && handleClickItem !== undefined) {
            handleClickItem(patient.id);
        }
    };

    const getTitle = (): string => {
        let result = '';
        if (patient.phone) result += `Phone: ${patient.phone}`;
        if (patient.email) result += result ? ` | Email: ${patient.email}` : `Email: ${patient.email}`;
        if (patient.address) result += result ? ` | Address: ${patient.address}` : `Address: ${patient.address}`;
        return result;
    };

    return (
        <div
            className={`base-patient-queue select-none hover:bg-gray p-2 rounded flex items-center justify-between first:mt-0 mt-2 group hover:bg-[#f5f5f5] ${handleClickItem !== null && handleClickItem !== undefined ? 'cursor-pointer' : ''}`}
            onClick={handleClickWrapper}
            title={getTitle()}
        >
            <div className="flex items-center">
                <div className="left text-primary w-[30px] flex items-center justify-center mr-4 text-[18px]">{`# ${no}`}</div>
                <div className="right space-y-1 w-[250px]">
                    <div className="flex items-center">
                        <p className="name font-bold text-[18px]">{patient.name}</p>
                        <p className="other-infor text-[#4e4e4e] ml-[4px]">{`(${patient.gender})`}</p>
                    </div>
                    <div className="other-infor text-[#4e4e4e] italic text-[12px]">{patient.reason}</div>
                    <div className="other-infor text-[#4e4e4e] text-[12px]">{patient.examinationPackageName}</div>
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
