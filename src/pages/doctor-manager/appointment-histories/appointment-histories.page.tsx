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
    FormHelperText,
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
import { useFormik } from 'formik';
import { INITIAL_APPOINTMENTS_HISTORIES_VALUES } from '@/constants/appointmentHistories.const';
import { appointmentHistoriesSchema } from '@/validations/appointmentHistories.validation';
import { useDispatch } from 'react-redux';
import { setNotAssigned } from '@/stores/manager/manager.action';
import { ROLE_NAMES } from '@/enums/Common';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const AppointmentHistories = () => {
    const dispatch = useDispatch();
    const { subscribeOnce } = useObservable();
    const { userData } = useAuth() as AuthContextType;
    const [searchValue, setSearchValue] = useState('');
    const [doctors, setDoctors] = useState<any[]>([]);
    const [appointmentData, setAppointmentData] = useState<any[]>([]);
    const [selectedAppointment, setSelectedAppointment] = useState<any>();
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
    const [isShowAssignPopup, setIsShowAssignPopup] = useState(false);
    const [dataSource, setDataSource] = useState<DynamicFieldType[]>(getInitialData());
    const [resultModal, setResultModal] = useState<any>();
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    const PAGE_NUMBER = 6;

    const formik = useFormik({
        initialValues: INITIAL_APPOINTMENTS_HISTORIES_VALUES.INFORMATION,
        validationSchema: appointmentHistoriesSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

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
        if (userData && isInitialized) {
            getDataSource(userData.id);
        }
    }, [pageIndex]);

    useEffect(() => {
        if (isResetFilter) return;
        if (pageIndex === 1 && userData && isInitialized) {
            getDataSource(userData.id);
        } else if (pageIndex !== 1) setPageIndex(1);
    }, [searchValue, examinationType, doctorId, dateRequestData]);

    useEffect(() => {
        if (userData && isInitialized && isResetFilter) getDataSource(userData.id);
        setIsResetFilter(false);
        if (!isInitialized) setIsInitialized(true);
    }, [isResetFilter]);

    const handleSetIsShowCreatePopup = (type: boolean) => {
        setIsShowDetailsPopup(type);
    };

    const handleSetIsShowAssignPopup = (type: boolean) => {
        setIsShowAssignPopup(type);
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

    const handleSelectedDoctor = ($event: any) => {
        formik.setFieldValue('doctorId', $event.target.value);
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
            if (res) {
                setDataSource(cloneDeep(JSON.parse(res.diagnostic)));
            }
            setResultModal(appointment.results ? appointment.results[0] : null); // Currently, defaults to the first result
        });
        handleSetIsShowCreatePopup(true);
    };

    const onClickAssignDoctor = (appointment: Appointments) => {
        handleSetIsShowAssignPopup(true);
        setSelectedAppointment(appointment.id);
    };

    const handleSubmit = (values: { doctorId: string }) => {
        if (!values.doctorId) {
            addToast({
                text: SystemMessage.DOCTOR_REQUIRED,
                position: ToastPositionEnum.TopRight,
                status: ToastStatusEnum.InValid,
            });
            return;
        }
        subscribeOnce(AppointmentService.assignDoctor(selectedAppointment, values.doctorId), (res: number) => {
            dispatch(setNotAssigned(res) as any);
            if (userData?.id) getDataSource(userData.id);
            setIsShowAssignPopup(false);
            addToast({ text: SystemMessage.ASSIGNED_DOCTOR, position: ToastPositionEnum.TopRight });
        });
    };

    return (
        <>
            <div className="h-[calc(100vh-52px-30px)] mr-[-24px] pr-[16px] pb-[4px] overflow-y-auto overflow-x-hidden bg-gray">
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
                                className="bg-white"
                                value={searchValue}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                    handleSearchValueChanged(event)
                                }
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
                                className="w-full bg-white"
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
                                className="w-full bg-white"
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
                                    className="bg-white"
                                    value={dateFilterData}
                                    onChange={(newValue) => handleChangeDateFilter(newValue)}
                                />
                            </LocalizationProvider>
                        </div>
                        <div
                            className="flex items-center mt-auto justify-center ml-[20px] w-[200px] border border-[#a8a8a8] rounded-md p-[6px] cursor-pointer hover:bg-[#f3f3f3] bg-white"
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
                                                        appointment.doctorAvatar
                                                            ? appointment.doctorAvatar
                                                            : avatarDefault
                                                    }
                                                />
                                                {appointment.doctorName ? (
                                                    <p>{appointment.doctorName}</p>
                                                ) : (
                                                    <p
                                                        className="w-full text-center bg-primary cursor-pointer select-none text-white py-[2px] hover:bg-[#2c84dc]"
                                                        onClick={() => onClickAssignDoctor(appointment)}
                                                    >
                                                        Assign
                                                    </p>
                                                )}
                                                <div className="items-center justify-center">
                                                    <div className="flex gap-2 items-center">
                                                        <Images.LuClock size={18} />
                                                        <span>
                                                            {`${appointment.startDateExpectation} - ${appointment.endDateExpectation}`}
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
                                                            className="w-full select-none"
                                                            variant="outlined"
                                                            label={getStatusText(appointment.status)}
                                                            color={getStatusColor(appointment.status)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-y-1 flex-1 min-w-[200px]">
                                            <div className="flex gap-x-2" title="Patient">
                                                <Images.FaUser className="text-[18px]" />
                                                <p>{appointment.name}</p>
                                            </div>
                                            <div className="flex gap-x-2" title="Gender">
                                                <Images.PiGenderIntersexFill className="text-[18px]" />
                                                <p>{appointment.gender}</p>
                                            </div>
                                            <div className="flex gap-x-2" title="Phone number">
                                                <Images.FaPhoneSquareAlt className="text-[18px]" />
                                                <p>{appointment.phone}</p>
                                            </div>
                                            <div className="flex gap-x-2 w-full pr-[10px]" title="Email">
                                                <Images.MdEmail className="text-[18px]" />
                                                <p className="flex-1 truncate">{appointment.email}</p>
                                            </div>
                                            {appointment.address && (
                                                <div className="flex gap-x-2 w-full pr-[10px]" title="Address">
                                                    <Images.FaLocationDot className="text-[18px]" />
                                                    <p className="flex-1 truncate">{appointment.address}</p>
                                                </div>
                                            )}
                                            {appointment.reason && (
                                                <div className="flex gap-x-2 w-full pr-[10px]" title="Reason">
                                                    <Images.MdSick className="text-[18px]" />
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
                                        View result
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
                                className="w-fit select-none"
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

            {/* Assign doctor */}
            <StyledDialog
                onClose={() => handleSetIsShowAssignPopup(false)}
                aria-labelledby="customized-dialog-title"
                open={isShowAssignPopup}
                maxWidth="lg"
            >
                <DialogTitle className="text-[20px]" sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    <div className="flex items-center space-x-2">
                        <span>Assign Doctor</span>
                    </div>
                </DialogTitle>

                <IconButton
                    aria-label="close"
                    onClick={() => handleSetIsShowAssignPopup(false)}
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
                    <form onSubmit={formik.handleSubmit}>
                        <div className="flex flex-col w-[300px] h-[100px]">
                            <div>Doctor:</div>
                            <Select
                                className="w-full"
                                size="medium"
                                displayEmpty
                                value={formik.values.doctorId}
                                onChange={($event: any) => handleSelectedDoctor($event)}
                                error={formik.touched.doctorId && Boolean(formik.errors.doctorId)}
                            >
                                {doctors
                                    .filter((item: any) => item.roles.includes(ROLE_NAMES.DOCTOR))
                                    .map((item: any) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {`${item.firstname} ${item.lastname}`}
                                        </MenuItem>
                                    ))}
                            </Select>
                            <FormHelperText>
                                <span className="text-[#d32f2f]">{formik.errors.doctorId}</span>
                            </FormHelperText>
                        </div>
                        <div className="flex items-center justify-end mt-[16px] gap-x-[10px]">
                            <Button variant="text" color="inherit" onClick={() => handleSetIsShowAssignPopup(false)}>
                                Cancel
                            </Button>
                            <Button variant="contained" type="submit">
                                Assign
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </StyledDialog>
        </>
    );
};

export default AppointmentHistories;
