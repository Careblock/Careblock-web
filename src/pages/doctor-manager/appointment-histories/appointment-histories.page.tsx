import {
    Button,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    Chip,
    DialogContent,
    styled,
    DialogTitle,
    IconButton,
    DialogActions,
} from '@mui/material';
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
import AccountService from '@/services/account.service';
import { Place } from '@/enums/Place';
import { Doctors } from '@/types/doctor.type';
import { EMPTY_GUID } from '@/constants/common.const';
import Nodata from '@/components/base/no-data/nodata.component';
import { BrowserWallet } from '@meshsdk/core';
import ResultService from '@/services/result.service';
import { SystemMessage } from '@/constants/message.const';
import { addToast } from '@/components/base/toast/toast.service';
import { ToastPositionEnum, ToastStatusEnum } from '@/components/base/toast/toast.type';
import { RESULT_ACTION_NAME, RESULT_STATUS, RESULT_STATUS_NAME } from '@/enums/Result';
import DynamicResult from '@/components/others/dynamic-result/dynamic-result.component';
import { FormType } from '@/enums/FormType';
import { cloneDeep } from 'lodash';
import { dynamicFieldData } from '@/mocks/dynamic-field';
import { DynamicFieldType } from '@/types/dynamic-field.type';
import Dialog from '@mui/material/Dialog';
import { Appointments } from '@/types/appointment.type';
import AppointmentDetailService from '@/services/appointmentDetail.service';
import { AppointmentDetails } from '@/types/appointmentDetail.type';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const AppointmentHistories = () => {
    const { subscribeOnce } = useObservable();
    const { userData } = useAuth() as AuthContextType;
    const [searchValue, setSearchValue] = useState('');
    const [doctors, setDoctors] = useState<any[]>([]);
    const [appointmentData, setAppointmentData] = useState<any[]>([]);
    const [examinationType, setExaminationType] = useState<any>('');
    const [doctorId, setDoctorId] = useState<any>('');
    const [examinationTypes, setExaminationTypes] = useState<ExaminationTypes[]>([]);
    const [dateFilterData, setDateFilterData] = useState<any>(null);
    const [dateRequestData, setDateRequestData] = useState<any>(null);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [isResetFilter, setIsResetFilter] = useState<boolean>(false);
    const [walletAddress, setWalletAddress] = useState<string>();
    const [isShowDetailsPopup, setIsShowDetailsPopup] = useState(false);
    const [dataSource, setDataSource] = useState<DynamicFieldType[]>(getInitialData());
    const [resultModal, setResultModal] = useState<any>();

    const PAGE_NUMBER = 6;

    useEffect(() => {
        const getWalletAddress = async () => {
            let address = '';
            const wallet = await BrowserWallet.enable('eternl');
            const lstUsedAddress = await wallet.getUsedAddresses();
            if (lstUsedAddress?.length > 0) {
                address = lstUsedAddress[0];
            }
            if (!address) {
                const lstUnUsedAddress = await wallet.getUnusedAddresses();
                if (lstUnUsedAddress?.length > 0) {
                    address = lstUnUsedAddress[0];
                }
            }
            setWalletAddress(address);
        };

        getWalletAddress();
    }, []);

    useEffect(() => {
        setTitle('Appointments history | CareBlock');

        if (userData) {
            getDataSource(userData.id);
            getDoctorDatas();

            subscribeOnce(ExaminationTypeService.getByUserId(userData.id), (res: ExaminationTypes[]) => {
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
    }, [searchValue, examinationType, doctorId, dateRequestData]);

    useEffect(() => {
        if (userData) getDataSource(userData.id);
        setIsResetFilter(false);
    }, [isResetFilter]);

    const handleSetIsShowCreatePopup = (type: boolean) => {
        setIsShowDetailsPopup(type);
    };

    function getInitialData() {
        return cloneDeep(dynamicFieldData);
    }

    const getDoctorDatas = () => {
        if (!userData?.id) return;
        subscribeOnce(AccountService.getDoctorsOrg(Place.Inclusive, userData.id), (res: Doctors[]) => {
            setDoctors(res);
        });
    };

    const getDataSource = (userId: string) => {
        const request: AppointmentRequest = {
            pageIndex: pageIndex,
            pageNumber: PAGE_NUMBER,
            userId: userId,
            keyword: searchValue,
            doctorId: !doctorId ? EMPTY_GUID : doctorId,
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
                doctorId: appointment.doctorId,
                symptom: appointment.symptom?.trim(),
                note: appointment.note?.trim(),
                status: appointment.status,
                createdDate: format(new Date(appointment.createdDate), 'dd/MM/yyyy'),
                endDateReality: format(new Date(appointment.endDateReality), 'HH:mm'),
                startDateReality: format(new Date(appointment.startDateReality), 'HH:mm'),
                dateReality: format(new Date(appointment.startDateReality), 'dd/MM/yyyy'),
                results: appointment.results,
                patientWalletAddress: appointment.patientWalletAddress,
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

    const getResultStatusText = (status: any) => {
        if (status == RESULT_STATUS.DRAFT || status == RESULT_STATUS.PENDING) {
            return RESULT_STATUS_NAME.PENDING;
        }
        if (status == RESULT_STATUS.SIGNED || status == RESULT_STATUS.SENT) {
            return RESULT_STATUS_NAME.SIGNED;
        }
    };

    const getResultStatusColor = (status: any) => {
        if (status == RESULT_STATUS.DRAFT || status == RESULT_STATUS.PENDING) {
            return Color.info;
        }
        if (status == RESULT_STATUS.SIGNED || status == RESULT_STATUS.SENT) {
            return Color.success;
        }
    };

    const handleChangeExaminationType = ($event: any) => {
        setExaminationType($event.target.value);
    };

    const handleChangeDoctor = ($event: any) => {
        setDoctorId($event.target.value);
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
        setDoctorId('');
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

    const handleSignResult = async (result: any) => {
        try {
            const wallet = await BrowserWallet.enable('eternl');
            let unsignedTx = result.signHash;
            const signedTx = await wallet.signTx(unsignedTx, true);
            await wallet.submitTx(signedTx);

            const payload = {
                resultId: result.id,
                signHash: signedTx,
                signerAddress: walletAddress,
            };

            subscribeOnce(ResultService.sign(payload), () => {
                addToast({
                    text: SystemMessage.SIGN_RESULT,
                    position: ToastPositionEnum.TopRight,
                    status: ToastStatusEnum.Valid,
                });
                setIsResetFilter(true);
                setIsShowDetailsPopup(false);
            });
        } catch (err) {
            console.error(err);
            addToast({
                text: SystemMessage.SIGN_RESULT_FAILED,
                position: ToastPositionEnum.TopRight,
                status: ToastStatusEnum.InValid,
            });
        }
    };

    const onClickViewDetails = (appointment: Appointments) => {
        if (!appointment.id) return;
        subscribeOnce(AppointmentDetailService.getByAppointmentId(appointment.id), (res: AppointmentDetails) => {
            setDataSource(cloneDeep(JSON.parse(res.diagnostic)));
            setResultModal(appointment.results ? appointment.results[0] : null); // Currently, defaults to the first result
        });
        handleSetIsShowCreatePopup(true);
    };

    return (
        <div className="h-full overflow-hidden bg-gray">
            <div className="text-center text-[20px] font-bold">Appointment Histories</div>
            <div className="flex items-center justify-center gap-x-[8px] select-none mb-[10px]">
                <div
                    className="flex items-center justify-center cursor-pointer rounded-full hover:bg-[#eee]"
                    onClick={handleClickPrevious}
                >
                    <Images.ArrowBackIosNewIcon fontSize="small" />
                </div>
                <p className="text-[16px]">
                    {pageIndex}/{totalPage}
                </p>
                <div
                    className="flex items-center justify-center cursor-pointer rounded-full hover:bg-[#eee]"
                    onClick={handleClickNext}
                >
                    <Images.ArrowForwardIosIcon fontSize="small" />
                </div>
            </div>
            <div className="flex items-center justify-between w-full bg-[#f4f4f4] rounded-lg p-[16px] mb-[10px]">
                <div className="flex items-center w-full justify-around gap-x-[10xp]">
                    <div className="flex flex-col w-full">
                        <div>Search:</div>
                        <TextField
                            variant="outlined"
                            size="medium"
                            label=""
                            placeholder="Enter keyword"
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
                    <div className="flex flex-col ml-[20px] w-full">
                        <div>Doctor:</div>
                        <Select
                            className="w-full"
                            size="medium"
                            displayEmpty
                            value={doctorId}
                            onChange={($event: any) => handleChangeDoctor($event)}
                        >
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            {doctors.map((item: any) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {`${item.firstname} ${item.lastname}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <div className="flex flex-col ml-[20px] w-full">
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
                    <div className="flex flex-col ml-[20px] w-full">
                        <div>Date:</div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={dateFilterData}
                                onChange={(newValue) => handleChangeDateFilter(newValue)}
                            />
                        </LocalizationProvider>
                    </div>
                    <div
                        className="flex items-center mt-auto justify-center ml-[20px] w-[200px] border border-[#a8a8a8] rounded-md p-[6px] cursor-pointer hover:bg-[#d5d5d5]"
                        title="Reset filter data"
                        onClick={handleClickResetFilter}
                    >
                        <Images.GrPowerReset className="!w-full !h-full text-[#a8a8a8]" />
                    </div>
                </div>
            </div>
            <div className="flex justify-start items-center flex-wrap gap-[20px]">
                {appointmentData.length ? (
                    appointmentData.map((appointment: any) => (
                        <div
                            className="flex flex-col justify-between w-[calc(33.33%-20px)] p-4 bg-white border border-[#ccc] border-solid rounded-md  min-h-[320px]"
                            key={appointment.id}
                        >
                            <div className="flex flex-col min-h-[240px]">
                                <p
                                    className="text-center mb-[14px] font-bold text-[16px] border-b border-[#ccc] pb-[10px] truncate"
                                    title={appointment.examinationPackageName}
                                >
                                    {appointment.examinationPackageName}
                                </p>
                                <div className="flex justify-between h-full">
                                    <div className="min-w-[130px] flex flex-col items-center w-[40%] gap-2 pr-[20px] h-full justify-between">
                                        <div className="flex flex-col items-center gap-[4px]">
                                            <img
                                                alt="avatar"
                                                className="w-[60px] h-[60px] object-cover rounded-full border mb-1"
                                                src={
                                                    appointment.doctorAvatar ? appointment.doctorAvatar : avatarDefault
                                                }
                                            />
                                            {appointment.doctorName && <p>{appointment.doctorName}</p>}
                                            <div className="items-center justify-center">
                                                <div className="flex gap-2 items-center">
                                                    <Images.LuClock size={18} />
                                                    <span>
                                                        {appointment.startDateExpectation} -
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
                                            <div className="flex w-full items-center mt-1">
                                                <div className="flex-1 truncate w-full">
                                                    <Chip
                                                        className="w-full"
                                                        variant="outlined"
                                                        label={getStatusText(appointment.status)}
                                                        color={getStatusColor(appointment.status)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-y-1 flex-1 min-w-[200px]">
                                        <div className="flex gap-x-2">
                                            <p className="font-bold">Hospital:</p>
                                            <p>{appointment.organizationName}</p>
                                        </div>
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
                                        <div className="flex gap-x-2 w-full pr-[10px]">
                                            <p className="font-bold">Email:</p>
                                            <p className="flex-1 truncate">{appointment.email}</p>
                                        </div>
                                        {appointment.address && (
                                            <div className="flex gap-x-2 w-full pr-[10px]">
                                                <p className="font-bold">Address:</p>
                                                <p className="flex-1 truncate">{appointment.address}</p>
                                            </div>
                                        )}
                                        {appointment.reason && (
                                            <div className="flex gap-x-2 w-full pr-[10px]">
                                                <p className="font-bold">Reason:</p>
                                                <p className="flex-1 truncate">{appointment.reason}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {appointment.status === APPOINTMENT_STATUS_NAME.CHECKEDIN && (
                                <Button
                                    className="w-full"
                                    variant="contained"
                                    onClick={() => onClickViewDetails(appointment)}
                                >
                                    View details
                                </Button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="w-[340px] mx-auto">
                        <Nodata />
                    </div>
                )}
            </div>

            <StyledDialog
                onClose={() => handleSetIsShowCreatePopup(false)}
                aria-labelledby="customized-dialog-title"
                open={isShowDetailsPopup}
                maxWidth="lg"
            >
                <DialogTitle className="text-[20px]" sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    <div className="flex items-center space-x-2">
                        <span>Consultation Request</span>
                        {resultModal && (
                            <Chip
                                className="w-fit"
                                variant="outlined"
                                label={getResultStatusText(resultModal.status)}
                                color={getResultStatusColor(resultModal.status)}
                                sx={{
                                    fontSize: '0.75rem',
                                    borderRadius: '16px',
                                    height: '24px',
                                    padding: '0 8px',
                                }}
                            />
                        )}
                    </div>
                </DialogTitle>

                <IconButton
                    aria-label="close"
                    onClick={() => handleSetIsShowCreatePopup(false)}
                    sx={{
                        position: 'absolute',
                        right: 10,
                        top: 10,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Images.CloseIcon className="!text-[28px]" />
                </IconButton>

                {/* Content */}
                <DialogContent dividers>
                    <DynamicResult type={FormType.Detail} datasource={dataSource} setDataSubmit={() => {}} />
                </DialogContent>

                {/* Footer */}
                <DialogActions>
                    <div className="flex items-center justify-between w-full">
                        <div></div>
                        <div className="flex items-center gap-x-[10px]">
                            {resultModal &&
                                (resultModal.status == RESULT_STATUS.PENDING ||
                                    resultModal.status == RESULT_STATUS.DRAFT) && (
                                    <Button variant="contained" autoFocus onClick={() => handleSignResult(resultModal)}>
                                        {RESULT_ACTION_NAME.SIGN}
                                    </Button>
                                )}
                        </div>
                    </div>
                </DialogActions>
            </StyledDialog>
        </div>
    );
};

export default AppointmentHistories;
