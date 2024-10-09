import { Card, Button, TextField, InputAdornment, Select, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import AppointmentService from '@/services/appointment.service';
import avatarDefault from '@/assets/images/auth/avatarDefault.png';
import { APPOINTMENT_STATUS_NAME } from '@/enums/Appointment';
import { AuthContextType } from '@/types/auth.type';
import useObservable from '@/hooks/use-observable.hook';
import { useAuth } from '@/contexts/auth.context';
import { Images } from '@/assets/images';
import { Color } from '@/enums/Color';
import { setTitle } from '@/utils/document';
import ExaminationTypeService from '@/services/examinationType.service';
import { ExaminationTypes } from '@/types/examinationType.type';
import { AppointmentRequest } from '@/types/appointmentRequest.type';
import { PagingResponse } from '@/types/pagingResponse.type';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const AppointmentHistories = () => {
    const { subscribeOnce } = useObservable();
    const { userData } = useAuth() as AuthContextType;
    const [searchValue, setSearchValue] = useState('');
    const [appointmentData, setAppointmentData] = useState<any[]>([]);
    const [examinationType, setExaminationType] = useState<any>('');
    const [examinationTypes, setExaminationTypes] = useState<ExaminationTypes[]>([]);
    const [dateFilterData, setDateFilterData] = useState<any>(null);
    const [dateRequestData, setDateRequestData] = useState<any>(null);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [isResetFilter, setIsResetFilter] = useState<boolean>(false);
    const PAGE_NUMBER = 6;

    useEffect(() => {
        setTitle('Appointments history | CareBlock');

        if (userData) {
            getDataSource(userData.id);

            subscribeOnce(ExaminationTypeService.getAll(), (res: ExaminationTypes[]) => {
                if (res) setExaminationTypes(res);
            });
        }
    }, []);

    useEffect(() => {
        if (isResetFilter) return;
        if (userData) {
            getDataSource(userData.id);
        }
    }, [pageIndex]);

    useEffect(() => {
        if (isResetFilter) return;
        if (pageIndex === 1 && userData) {
            getDataSource(userData.id);
        } else setPageIndex(1);
    }, [searchValue, examinationType, dateRequestData]);

    useEffect(() => {
        if (userData) getDataSource(userData.id);
        setIsResetFilter(false);
    }, [isResetFilter]);

    const getDataSource = (userId: string) => {
        const request: AppointmentRequest = {
            pageIndex: pageIndex,
            pageNumber: PAGE_NUMBER,
            userId: userId,
            keyword: searchValue,
            examinationTypeId: !examinationType ? -1 : examinationType,
            createdDate: dateRequestData,
        };

        subscribeOnce(AppointmentService.getOrgAppointmentHistories(request), (res: PagingResponse) => {
            const theData = res.pageData.map((appointment: any) => ({
                id: appointment.id,
                doctorName: appointment.doctorName?.trim(),
                doctorAvatar: appointment.doctorAvatar,
                name: appointment.name?.trim(),
                gender: appointment.gender,
                phone: appointment.phone?.trim(),
                email: appointment.email?.trim(),
                address: appointment.address?.trim(),
                organizationName: appointment.organizationName?.trim(),
                examinationPackageName: appointment.examinationPackageName?.trim(),
                reason: appointment.reason?.trim(),
                endDateExpectation: format(new Date(appointment.endDateExpectation), 'HH:mm'),
                startDateExpectation: format(new Date(appointment.startDateExpectation), 'HH:mm'),
                dateExpectation: format(new Date(appointment.startDateExpectation), 'dd/MM/yyyy'),
                patientId: appointment.patientId,
                doctorId: appointment.doctorAvatar,
                symptom: appointment.symptom?.trim(),
                note: appointment.note?.trim(),
                status: appointment.status,
                createdDate: format(new Date(appointment.createdDate), 'dd/MM/yyyy'),
                endDateReality: format(new Date(appointment.endDateReality), 'HH:mm'),
                startDateReality: format(new Date(appointment.startDateReality), 'HH:mm'),
                dateReality: format(new Date(appointment.startDateReality), 'dd/MM/yyyy'),
            }));
            setAppointmentData(theData);
            setTotalPage(Math.ceil(res.total / PAGE_NUMBER));
        });
    };

    const handleSearchValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value.toLocaleLowerCase());
    };

    const getStatusColor = (status: any) => {
        if (status === APPOINTMENT_STATUS_NAME.ACTIVE) {
            return Color.success;
        } else if (status === APPOINTMENT_STATUS_NAME.POSTPONED) {
            return Color.warning;
        } else if (status === APPOINTMENT_STATUS_NAME.REJECTED) {
            return Color.error;
        } else if (status === APPOINTMENT_STATUS_NAME.CHECKEDIN) {
            return Color.info;
        }
    };

    const getStatusText = (status: any) => {
        if (status === APPOINTMENT_STATUS_NAME.ACTIVE) {
            return APPOINTMENT_STATUS_NAME.ACTIVE;
        } else if (status === APPOINTMENT_STATUS_NAME.POSTPONED) {
            return APPOINTMENT_STATUS_NAME.POSTPONED;
        } else if (status === APPOINTMENT_STATUS_NAME.REJECTED) {
            return APPOINTMENT_STATUS_NAME.REJECTED;
        } else if (status === APPOINTMENT_STATUS_NAME.CHECKEDIN) {
            return APPOINTMENT_STATUS_NAME.CHECKEDIN;
        }
    };

    const handleChangeExaminationType = ($event: any) => {
        setExaminationType($event.target.value);
    };

    const handleChangeDateFilter = (newValue: any) => {
        const tempDate = newValue.format('YYYY-MM-DD');
        setDateRequestData(tempDate);
        setDateFilterData(newValue);
    };

    const handleClickResetFilter = () => {
        setSearchValue('');
        setPageIndex(1);
        setExaminationType(-1);
        setDateFilterData(null);
        setDateRequestData(null);
        setIsResetFilter(true);
    };

    const handleClickPrevious = () => {
        const prevIndex = pageIndex - 1;
        if (prevIndex > 0) {
            setPageIndex(prevIndex);
        }
    };

    const handleClickNext = () => {
        const nextIndex = pageIndex + 1;
        if (nextIndex <= totalPage) {
            setPageIndex(nextIndex);
        }
    };

    return (
        <div className="h-full overflow-hidden bg-gray">
            <div className="text-center text-[20px] font-bold mb-3">Appointment Histories</div>
            <div className="flex items-center justify-between w-full bg-[#e6e6e6] rounded-lg p-[16px] mb-[10px]">
                <div className="flex items-center gap-x-[10xp]">
                    <div className="flex flex-col w-[240px]">
                        <div>Search:</div>
                        <TextField
                            variant="outlined"
                            size="medium"
                            label=""
                            placeholder="Enter keyword"
                            className="w-[240px]"
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
                    <div className="flex flex-col ml-[20px] w-[240px]">
                        <div>Examination type:</div>
                        <Select
                            className="w-full"
                            size="medium"
                            displayEmpty
                            value={examinationType}
                            onChange={($event: any) => handleChangeExaminationType($event)}
                        >
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            {examinationTypes.map((item: any) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <div className="flex flex-col ml-[20px] w-[260px]">
                        <div>Date:</div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                className="w-[260px]"
                                value={dateFilterData}
                                onChange={(newValue) => handleChangeDateFilter(newValue)}
                            />
                        </LocalizationProvider>
                    </div>
                    <div
                        className="flex items-center justify-center ml-[20px] size-[36px] border border-[black] rounded-md p-[6px] cursor-pointer hover:bg-[#f1f1f1]"
                        title="Reset filter data"
                        onClick={handleClickResetFilter}
                    >
                        <Images.GrPowerReset className="!w-full !h-full" />
                    </div>
                </div>
                <div className="flex items-center gap-x-[8px] select-none">
                    <div
                        className="flex items-center justify-center cursor-pointer rounded-full size-[20px] hover:bg-[#eee]"
                        onClick={handleClickPrevious}
                    >
                        <Images.ArrowBackIosNewIcon className="!w-full !h-full" />
                    </div>
                    <p className="text-[16px]">
                        {pageIndex}/{totalPage}
                    </p>
                    <div
                        className="flex items-center justify-center cursor-pointer rounded-full size-[20px] hover:bg-[#eee]"
                        onClick={handleClickNext}
                    >
                        <Images.ArrowForwardIosIcon className="!w-full !h-full" />
                    </div>
                </div>
            </div>
            <div className="flex justify-start items-center flex-wrap gap-[20px]">
                {appointmentData.length ? (
                    appointmentData.map((appointment: any) => (
                        <div className="w-[30%] bg-white" key={appointment.id}>
                            <Card>
                                <div className="flex flex-col p-4 border border-[#ccc] border-solid h-[258px]">
                                    <p
                                        className="text-center mb-[14px] font-bold text-[16px] border-b border-[#ccc] pb-[10px] truncate"
                                        title={appointment.examinationPackageName}
                                    >
                                        {appointment.examinationPackageName}
                                    </p>
                                    <div className="flex justify-between">
                                        <div className="flex flex-col items-center w-[40%] gap-2 pr-2">
                                            <img
                                                alt="avatar"
                                                className="w-[60px] h-[60px] object-cover rounded-[175px] border mb-1"
                                                src={
                                                    appointment.doctorAvatar ? appointment.doctorAvatar : avatarDefault
                                                }
                                            />
                                            {appointment.doctorName && <p>{appointment.doctorName}</p>}
                                            <div className="items-center justify-center">
                                                <div className="flex gap-2 items-center">
                                                    <Images.LuClock size={18} />
                                                    <span>
                                                        {appointment.startDateExpectation} -{' '}
                                                        {appointment.endDateExpectation}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="items-center justify-center">
                                                <div className="flex gap-2 items-center">
                                                    <Images.FaRegCalendarAlt size={18} />
                                                    <span>{appointment.dateExpectation}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <Button
                                                    className="mt-6 p-4 w-[120px] font-bold"
                                                    variant="contained"
                                                    color={getStatusColor(appointment.status)}
                                                >
                                                    {getStatusText(appointment.status)}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-y-1 flex-1">
                                            <div className="flex gap-x-2">
                                                <p className="font-bold">Hospital:</p>
                                                <p>{appointment.organizationName}</p>
                                            </div>
                                            {appointment.reason && (
                                                <div className="flex gap-x-2">
                                                    <p className="font-bold">Reason:</p>
                                                    <p>{appointment.reason}</p>
                                                </div>
                                            )}
                                            <div className="flex gap-x-2">
                                                <p className="font-bold">Patient:</p>
                                                <p>{appointment.name}</p>
                                            </div>
                                            <div className="flex gap-x-2">
                                                <p className="font-bold">Gender:</p>
                                                <p>{appointment.gender}</p>
                                            </div>
                                            <div className="flex gap-x-2">
                                                <p className="font-bold">Phone:</p>
                                                <p>{appointment.phone}</p>
                                            </div>
                                            <div className="flex gap-x-2">
                                                <p className="font-bold">Email:</p>
                                                <p>{appointment.email}</p>
                                            </div>
                                            {appointment.address && (
                                                <div className="flex gap-x-2">
                                                    <p className="font-bold">Address:</p>
                                                    <p>{appointment.address}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))
                ) : (
                    <div className="mb-6 flex items-center flex-col justify-center w-full">
                        <div className="image w-[300px] overflow-hidden">
                            <img className="w-full object-cover" src={Images.BgNodata} alt="no data" />
                        </div>
                        <div className="text-[20px]">No data to display</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentHistories;
