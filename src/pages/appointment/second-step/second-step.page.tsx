import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormHelperText, InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Dayjs } from 'dayjs';
import { formatStandardDateTime } from '@/utils/datetime.helper';
import avatarDefault from '@/assets/images/auth/avatarDefault.png';
import { getStandardNumber } from '@/utils/number.helper';
import useObservable from '@/hooks/use-observable.hook';
import { SecondStepProps } from './second-step.type';
import { Images } from '@/assets/images';
import { setTitle } from '@/utils/document';
import ExaminationPackageService from '@/services/examinationPackage.service';
import { ExaminationPackagesResponse } from '@/types/examinationPackageResponse.type';
import { cloneDeep } from 'lodash';
import { Organizations } from '@/types/organization.type';
import OrganizationService from '@/services/organization.service';

const SecondStep = ({ scheduleData, setScheduleData, examinationType }: SecondStepProps) => {
    const { subscribeOnce } = useObservable();
    const [initialized, setInitialized] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [timeRanges, setTimeRanges] = useState<any[]>([]);
    const [organization, setOrganization] = useState<string>('');
    const [organizations, setOrganizations] = useState<Organizations[]>([]);
    const [examinationPackages, setExaminationPackages] = useState<ExaminationPackagesResponse[]>([]);
    const [examinationPackagesDisplay, setExaminationPackagesDisplay] = useState<
        ExaminationPackagesResponse[] | undefined
    >([]);

    useEffect(() => {
        setTitle('Second step | CareBlock');

        subscribeOnce(OrganizationService.getAllOrganization(), (res: any) => {
            setOrganizations(res.map((data: any) => ({ name: data.name, organizationId: data.id })));
        });

        getExaminationPackageByType();
    }, []);

    const getExaminationPackageByType = () => {
        subscribeOnce(ExaminationPackageService.getByType(examinationType!.id!), (res: any) => {
            handleSetDatasource(res);
        });
    };

    const handleSetDatasource = (res: any) => {
        const data = res as ExaminationPackagesResponse[];
        setExaminationPackages([...data]);
        setExaminationPackagesDisplay([...data]);
        let timeRangesTemp: any[] = [];
        data.forEach((item) => {
            const timeSlots = item.timeSlots;
            let temp: any = {
                slots: [],
            };
            if (timeSlots) {
                timeSlots.forEach((timeSlot) => {
                    const { startTime, endTime, period } = timeSlot;

                    const start = new Date(`2024-08-18 ${startTime}`);
                    const end = new Date(`2024-08-18 ${endTime}`);
                    const totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
                    const slots: any[] = [];

                    for (let i = 0; i <= totalMinutes - period!; i += period!) {
                        const startSlot = new Date(start.getTime() + i * (1000 * 60));
                        const endSlot = new Date(start.getTime() + (i + period!) * (1000 * 60));
                        slots.push(`${startSlot.toTimeString().slice(0, 5)} - ${endSlot.toTimeString().slice(0, 5)}`);
                    }

                    temp.slots = [...temp.slots, ...slots];
                    temp.slots.sort();
                });
            }
            timeRangesTemp.push(temp.slots);
        });
        setTimeRanges(timeRangesTemp);
    };

    useEffect(() => {
        if (organization) {
            subscribeOnce(
                ExaminationPackageService.getByTypeAndOrganization(examinationType!.id!, organization),
                (res: any) => {
                    handleSetDatasource(res);
                }
            );
        } else {
            getExaminationPackageByType();
        }
    }, [organization]);

    useEffect(() => {
        if (!initialized) {
            let result = examinationPackages.filter((examPackage) => {
                if (examPackage.name?.includes(searchValue?.toLocaleLowerCase())) return examPackage;
            });
            setExaminationPackagesDisplay(result);
        } else setInitialized(false);
    }, [searchValue]);

    const handleDateChange = (date: Dayjs | null) => {
        setScheduleData({
            ...scheduleData,
            date: date,
        });
    };

    const isDisabledDateTime = (examPackage: ExaminationPackagesResponse, time: string) => {
        if (examPackage.appointments && scheduleData.date) {
            for (let appointment of examPackage.appointments) {
                const tempDate = scheduleData.date.format('YYYY-MM-DD').toString();
                const startDate = new Date(appointment.startDateExpectation!);
                const endDate = new Date(appointment.endDateExpectation!);
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

    const handleChoosePackage = (examPackage: ExaminationPackagesResponse, time: string) => {
        if (!isDisabledDateTime(examPackage, time)) {
            setScheduleData(
                cloneDeep({
                    ...scheduleData,
                    examinationPackage: examPackage,
                    time: time,
                })
            );
        }
    };

    const handleSearchValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const isSelectedTime = (examPackage: ExaminationPackagesResponse, time: string) => {
        return examPackage.id === scheduleData.examinationPackage?.id && time === scheduleData.time;
    };

    return (
        <div className="second-step__wrapper mb-[50px]">
            <div className="second-step__toolbar flex items-center rounded-lg p-5 min-h-12 my-5 bg-[#f5f5f5]">
                <TextField
                    variant="outlined"
                    label="Search"
                    helperText="Enter examination package's name"
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
                <div className="flex flex-col ml-[20px] w-[260px]">
                    <Select
                        className="w-full"
                        size="medium"
                        value={organization}
                        onChange={($event: any) => setOrganization($event.target.value)}
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        {organizations.map((item: any) => (
                            <MenuItem key={item.organizationId} value={item.organizationId}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>
                        <span className="block mt-[2px] mx-[14px]">Choose a hospital</span>
                    </FormHelperText>
                </div>
            </div>
            {examinationPackagesDisplay?.length ? (
                <div className="second-step__content">
                    {examinationPackagesDisplay.map((examPackage, i: number) => (
                        <div
                            className={`second-step-content__package select-none flex border border-solid border-[#ddd] rounded-lg p-5 first:mt-0 mt-4 ${examPackage.id === scheduleData.examinationPackage?.id ? 'selected' : ''}`}
                            key={examPackage.id}
                        >
                            <div className="second-step-wrapper__left flex flex-col justify-center space-y-[16px] w-[40%] pr-[50px] border-r border-solid border-[#ccc] max-h-[256px]">
                                <div className="wrapper-left__information">
                                    <div className="left-information__name font-bold text-[20px] text-primary mb-2">
                                        {examPackage.name}
                                    </div>
                                    <div className="left-information__seniority text-[16px]">
                                        {`${examPackage?.organizationName} Hospital`}
                                    </div>
                                </div>
                                <div className="wrapper-left__avatar flex-1 min-w-[60px] overflow-hidden rounded mr-4">
                                    <img
                                        className="w-full h-full min-h-[60px] object-cover"
                                        src={examPackage?.thumbnail ? examPackage.thumbnail : avatarDefault}
                                        alt={examPackage.name}
                                    />
                                </div>
                            </div>
                            <div className="second-step-wrapper__right w-[60%] pl-10">
                                <div className="wrapper-right__schedule">
                                    <div className="right-schedule__date">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                disablePast
                                                className="w-[360px]"
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
                                            {timeRanges[i].length > 0 ? (
                                                timeRanges[i].map((time: any, index: number) => (
                                                    <div
                                                        className={`time-selection__item cursor-pointer text-center w-[110px] bg-[#eee] rounded py-[6px] px-2 mr-[10px] mb-2 text-[13px] ${isSelectedTime(examPackage, time) ? 'selected' : ''} ${isDisabledDateTime(examPackage, time) ? '!cursor-not-allowed bg-[#bbb] opacity-50' : ''}`}
                                                        key={index}
                                                        onClick={() => handleChoosePackage(examPackage, time)}
                                                    >
                                                        {time}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="italic mb-[8px]">No specific examination time</p>
                                            )}
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
                                    <div className="right-location__text text-[16px]">
                                        {examPackage?.organizationLocation}
                                    </div>
                                </div>
                                <div className="wrapper-right__price mt-2 pt-2 border-t border-solid border-[#ddd] flex items-baseline">
                                    <div className="right-price-text mr-[6px] uppercase text-[16px]">{`Price: $${examPackage.price}`}</div>
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
