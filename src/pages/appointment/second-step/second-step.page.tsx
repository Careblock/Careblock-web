import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { InputAdornment, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Dayjs } from 'dayjs';
import MedicalService from '@/services/medicalService.service';
import AccountService from '@/services/account.service';
import { formatStandardDateTime } from '@/utils/datetime.helper';
import avatarDefault from '@/assets/images/auth/avatarDefault.png';
import { MedicalServices } from '@/types/medical-services.type';
import { getStandardNumber } from '@/utils/number.helper';
import { getFullName } from '@/utils/common.helpers';
import useObservable from '@/hooks/use-observable.hook';
import { SecondStepProps } from './second-step.type';
import { Doctors } from '@/types/doctor.type';
import { Images } from '@/assets/images';
import { setTitle } from '@/utils/document';

const timeRanges = [
    '07:00 - 08:00',
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
];

const SecondStep = ({ scheduleData, setScheduleData, organization }: SecondStepProps) => {
    const { subscribeOnce } = useObservable();
    const [initialized, setInitialized] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [doctorData, setDoctorData] = useState<Doctors[]>([]);
    const [doctorDataDisplay, setDoctorDataDisplay] = useState<Doctors[] | undefined>([]);

    useEffect(() => {
        setTitle('Second step | CareBlock');
    }, []);

    useEffect(() => {
        subscribeOnce(AccountService.filterByOrganization(organization!.id), (res: Doctors[]) => {
            setDoctorData([...res]);
            setDoctorDataDisplay([...res]);
        });

        subscribeOnce(MedicalService.filterByOrganization(organization!.id), (res: MedicalServices[]) => {
            setScheduleData({
                ...scheduleData,
                price: res[0]?.price ?? 0,
            });
        });
    }, []);

    useEffect(() => {
        if (!initialized) {
            let result = doctorData.filter((doctor) => {
                if (
                    `${doctor.firstname.toLocaleLowerCase()} ${doctor.lastname?.toLocaleLowerCase()}`.includes(
                        searchValue?.toLocaleLowerCase()
                    ) ||
                    doctor.phone?.includes(searchValue?.toLocaleLowerCase())
                )
                    return doctor;
            });
            setDoctorDataDisplay(result);
        } else setInitialized(false);
    }, [searchValue]);

    const handleDateChange = (date: Dayjs | null) => {
        setScheduleData({
            ...scheduleData,
            date: date,
        });
    };

    const isDisabledDateTime = (doctor: Doctors, time: string) => {
        if (doctor.appointments && scheduleData.date) {
            for (let appointment of doctor.appointments) {
                const tempDate = scheduleData.date.format('YYYY-MM-DD').toString();
                const startDate = new Date(appointment.startTime);
                const endDate = new Date(appointment.endTime);
                const startTime = getStandardNumber(startDate.getHours());
                const endTime = getStandardNumber(endDate.getHours());
                const timeRange = `${startTime}:00 - ${endTime}:00`;
                if (timeRange === time && tempDate === formatStandardDateTime(startDate).split(' ')[0]) {
                    return true;
                }
            }
        }
        return false;
    };

    const handleChooseDoctor = (doctor: Doctors, time: string) => {
        if (!isDisabledDateTime(doctor, time)) {
            setScheduleData({
                ...scheduleData,
                doctor: { ...doctor },
                time: time,
            });
        }
    };

    const handleSearchValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    return (
        <div className="second-step__wrapper mb-[50px]">
            <div className="second-step__toolbar flex items-center rounded-lg p-5 min-h-12 my-5 bg-[#f5f5f5]">
                <TextField
                    variant="outlined"
                    label="Search"
                    helperText="Enter name or phone number"
                    value={searchValue}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSearchValueChanged(event)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Images.SearchIcon className="text-[24px]" />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            {doctorDataDisplay?.length ? (
                <div className="second-step__content">
                    {doctorDataDisplay.map((doctor) => (
                        <div
                            className={`second-step-content__doctor select-none flex border border-solid border-[#ddd] rounded-lg p-5 first:mt-0 mt-4 ${doctor.id === scheduleData.doctor?.id ? 'selected' : ''}`}
                            key={doctor.id}
                        >
                            <div className="second-step-wrapper__left block md:flex w-[40%] pr-[50px] border-r border-solid border-[#ccc]">
                                <div className="wrapper-left__avatar w-[60px] h-[60px] min-w-[60px] overflow-hidden rounded-full mr-4">
                                    <img
                                        className="w-[60px] h-[60px] min-h-[60px] object-cover"
                                        src={doctor?.avatar ? doctor?.avatar : avatarDefault}
                                        alt={getFullName(doctor)}
                                    />
                                </div>
                                <div className="wrapper-left__information">
                                    <div className="left-information__name font-bold text-[20px] text-primary mb-2">{`Doctor ${getFullName(doctor)} `}</div>
                                    <div className="left-information__seniority text-[16px]">
                                        {`Has ${doctor?.seniority} years of experience in the industry`}
                                    </div>
                                </div>
                            </div>
                            <div className="second-step-wrapper__right w-[60%] pl-10">
                                <div className="wrapper-right__schedule">
                                    <div className="right-schedule__date">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                disablePast
                                                value={scheduleData.date}
                                                slotProps={{ textField: { size: 'small' } }}
                                                onChange={(newValue) => handleDateChange(newValue)}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className="right-schedule__time mt-2">
                                        <div className="schedule-time__heading flex items-center mb-2">
                                            <Images.CalendarMonthIcon className="text-[20px]" />
                                            <div className="schedule-time-heading__text text-[16px] ml-[6px] mt-[1px] uppercase">
                                                Schedule
                                            </div>
                                        </div>
                                        <div className="schedule-time__selection flex items-center flex-wrap">
                                            {timeRanges.map((time, index) => (
                                                <div
                                                    className={`time-selection__item cursor-pointer text-center w-[110px] bg-[#eee] rounded py-[6px] px-2 mr-[10px] mb-2 text-[13px] ${doctor.id === scheduleData.doctor?.id && time === scheduleData.time ? 'selected' : ''} ${isDisabledDateTime(doctor, time) ? '!cursor-not-allowed bg-[#bbb] opacity-50' : ''}`}
                                                    key={index}
                                                    onClick={() => handleChooseDoctor(doctor, time)}
                                                >
                                                    {time}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="schedule-time__description">
                                            <div className="time-description__text mb-[2px] font-light flex items-center text-[13px]">
                                                <p>Select</p>
                                                {<Images.PanToolAltIcon className="text-[18px]" />}
                                                <p className="ml-[2px]">and book (Reservation fee 0 VND)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="wrapper-right__location mt-2 pt-2 border-t border-solid border-[#ddd]">
                                    <div className="right-location__heading text-[16px] uppercase mb-2">
                                        Medical examination address
                                    </div>
                                    <div className="right-location__text text-[16px]">{organization?.location}</div>
                                </div>
                                <div className="wrapper-right__price mt-2 pt-2 border-t border-solid border-[#ddd] flex items-baseline">
                                    <div className="right-price-text mr-[6px] uppercase text-[16px]">{`Price: $${scheduleData.price}`}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-6 flex items-center flex-col justify-center w-full">
                    <div className="image w-[300px] overflow-hidden">
                        <img className="w-full object-cover" src={Images.BgNodata} alt="no data" />
                    </div>
                    <div className="text-[20px]">No data to display</div>
                </div>
            )}
        </div>
    );
};

export default SecondStep;
