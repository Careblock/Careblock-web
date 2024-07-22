import { TextField } from '@mui/material';
import { ChangeEvent } from 'react';
import { getFullName } from '@/utils/common.helpers';
import { AuthContextType } from '@/types/auth.type';
import { FinalStepProps } from './final-step.type';
import { useAuth } from '@/contexts/auth.context';
import { Images } from '@/assets/images';

const FinalStep = ({ reason, setReason, organization, schedule }: FinalStepProps) => {
    const { userData } = useAuth() as AuthContextType;

    return (
        <div className="final-steps mt-5">
            <div className="final-steps__heading text-[20px] font-bold mb-8">Scheduled appointment</div>
            <div className="final-steps__content border border-[#ddd] shadow-lg bg-white flex w-[580px] rounded-xl mx-auto py-6 px-8">
                <div className="steps-content__left mr-14 flex flex-col items-center w-[140px]">
                    <div className="w-[60px] h-[60px] left-time__icon rounded-full border border-[#ddd] flex items-center justify-center mb-2">
                        <Images.VaccinesIcon className="!text-[36px] font-light text-primary" />
                    </div>
                    <p className="uppercase text-primary mb-3 text-[18px] font-bold">Physical Exam</p>
                    <div className="content-left__time flex items-center mb-2 text-[18px]">
                        <Images.AccessTimeIcon className="text-[18px]" />
                        <div className="left-time__text ml-1 text-[18px]">{schedule?.time}</div>
                    </div>
                    <div className="content-left__date  flex items-center text-[18px]">
                        <Images.CalendarMonthIcon className="text-[18px]" />
                        <div className="left-date__text ml-1 text-[18px]">{schedule?.date?.format('MM/DD/YYYY')}</div>
                    </div>
                </div>
                <div className="steps-content__right flex-1">
                    <div className="content-right__patient text-[16px] mb-1">
                        <b className="mr-1 text-[16px]">Patient:</b>
                        {`${userData?.firstname} ${userData?.lastname}`}
                    </div>
                    <div className="content-right__doctor text-[16px] mb-1">
                        <b className="mr-1 text-[16px]">Doctor:</b>
                        {getFullName(schedule?.doctor!)}
                    </div>
                    <div className="content-right__hospital text-[16px] mb-1">
                        <b className="mr-1 text-[16px]">Hospital:</b>
                        {organization?.name}
                    </div>
                    <div className="content-right__location text-[16px] mb-1">
                        <b className="mr-1 text-[16px]">Location:</b>
                        {organization?.location}
                    </div>
                    <div className="content-right__price text-[16px] mb-2">
                        <b className="mr-1 text-[16px]">Price:</b>
                        {`$${schedule?.price!}`}
                    </div>
                    <div className="content-right__reason w-full">
                        <TextField
                            label="Reason"
                            placeholder="Reason"
                            // multiline
                            // maxRows={5}
                            value={reason}
                            variant="filled"
                            className="w-full"
                            onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                                setReason(event.target.value)
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinalStep;
