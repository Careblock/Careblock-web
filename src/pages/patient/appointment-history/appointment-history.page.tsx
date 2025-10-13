import {
    Card,
    Button,
    Modal,
    Box,
    IconButton,
    Typography,
    TextField,
    Rating,
    Divider,
    Stack,
    Chip,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
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
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ExaminationPackageReviewService from '@/services/examinationPackageReview.service';
import { ExaminationPackageReview } from '@/types/examinationPackageReview.type';
import { uuidv4 } from '@/utils/common.helpers';
import { addToast } from '@/components/base/toast/toast.service';
import { SystemMessage } from '@/constants/message.const';
import { ToastPositionEnum, ToastStatusEnum } from '@/components/base/toast/toast.type';
import { BrowserWallet, Transaction, ForgeScript, AssetMetadata, Mint } from '@meshsdk/core';
import { formatDateToString } from '@/utils/datetime.helper';
import { capitalizedFirstCharacter } from '@/utils/string.helper';

const AppointmentHistory = () => {
    const { subscribeOnce } = useObservable();
    const { userData } = useAuth() as AuthContextType;
    const [appointmentData, setAppointmentData] = useState([]);
    const [formattedAppointments, setFormattedAppointments] = useState<any>([]);
    const [appointmentSelected, setAppointmentSelected] = useState<any>();
    const [openFeedback, setOpenFeedback] = useState<boolean>(false);
    const [walletAddress, setWalletAddress] = useState<string>('');

    useEffect(() => {
        setTitle('Appointments history | CareBlock');
        fetchData();
    }, []);

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
        const formattedData = appointmentData.map((appointment: any) => ({
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
            examinationPackageId: appointment.examinationPackageId,
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
            feedback: appointment.feedback,
            rating: appointment.rating,
        }));
        setFormattedAppointments(formattedData);
    }, [appointmentData]);

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

    const FeedbackModal: React.FC<any> = ({ open, handleClose }) => {
        const [reviewId, setReviewId] = useState<string | null>(null);

        const formik = useFormik({
            initialValues: {
                content: '',
                rating: 5,
            },
            validationSchema: Yup.object({
                content: Yup.string().required('Feedback is required'),
                rating: Yup.number().min(1).max(5).required('Rating is required'),
            }),
            onSubmit: (values) => {
                handleSubmit(values);
            },
        });

        useEffect(() => {
            if (appointmentSelected) {
                subscribeOnce(
                    ExaminationPackageReviewService.getByAppointmentID(appointmentSelected.id),
                    (res: any) => {
                        if (res) {
                            formik.setValues({
                                content: res.content || '',
                                rating: res.rating || 5,
                            });
                            setReviewId(res.id);
                        } else {
                            formik.resetForm();
                            setReviewId(null);
                        }
                    }
                );
            }
        }, [appointmentSelected]);

        const handleSubmit = async (values: any) => {
            if (userData) {
                try {
                    const payload = {
                        ...values,
                        userId: userData.id,
                        examinationPackageId: appointmentSelected.examinationPackageId,
                        appointmentId: appointmentSelected.id,
                    } as ExaminationPackageReview;

                    if (reviewId) {
                        subscribeOnce(
                            ExaminationPackageReviewService.update(reviewId, {
                                ...payload,
                                id: reviewId,
                            }),
                            (_: any) => {
                                addToast({ text: SystemMessage.FEEDBACK_UPDATE, position: ToastPositionEnum.TopRight });
                                handleClose(true);
                            }
                        );
                    } else {
                        let id = uuidv4();
                        const signedTx = await signFeedback(id);
                        subscribeOnce(
                            ExaminationPackageReviewService.create({
                                ...payload,
                                signHash: signedTx,
                                id,
                            }),
                            (_: any) => {
                                addToast({ text: SystemMessage.FEEDBACK_CREATE, position: ToastPositionEnum.TopRight });
                                handleClose(true);
                            }
                        );
                    }
                } catch (err) {
                    addToast({
                        text: SystemMessage.FEEDBACK_CREATE_FAILED,
                        position: ToastPositionEnum.TopRight,
                        status: ToastStatusEnum.InValid,
                    });
                    handleClose(true);
                }
            }
        };

        const signFeedback = async (id: string): Promise<string> => {
            const wallet = await BrowserWallet.enable('eternl');
            const forgingScript = ForgeScript.withOneSignature(walletAddress);
            const tx = new Transaction({ initiator: wallet });

            const assetMetadata: AssetMetadata = {
                id,
            };

            const asset: Mint = {
                assetName: `feedback_${capitalizedFirstCharacter(appointmentSelected.examinationPackageName)}_${formatDateToString(new Date())}`,
                assetQuantity: '1',
                metadata: assetMetadata,
                label: '721',
                recipient: walletAddress,
            };
            tx.mintAsset(forgingScript, asset);
            const unsignedTx = await tx.build();
            const signedTx = await wallet.signTx(unsignedTx);
            await wallet.submitTx(signedTx);
            return signedTx;
        };

        return (
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 420,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <CloseRoundedIcon />
                    </IconButton>
                    <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                        Feedback
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <form>
                        <TextField
                            name="content"
                            fullWidth
                            multiline
                            rows={3}
                            label="Tell us what can be Improved?"
                            variant="outlined"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.content}
                            error={formik.touched.content && Boolean(formik.errors.content)}
                            helperText={formik.touched.content && formik.errors.content}
                            sx={{ mt: 2 }}
                        />
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                            <Typography fontWeight="medium">Rating:</Typography>
                            <Rating
                                name="rating"
                                onBlur={formik.handleBlur}
                                value={formik.values.rating}
                                onChange={(_, newValue) => formik.setFieldValue('rating', newValue || 5)}
                                size="medium"
                            />
                        </Stack>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3 }}
                            type="button"
                            onClick={() => {
                                formik.submitForm();
                            }}
                        >
                            Submit
                        </Button>
                    </form>
                </Box>
            </Modal>
        );
    };

    const fetchData = () => {
        if (userData) {
            subscribeOnce(AppointmentService.getAppointmentHistories(userData.id), (res: any) => {
                setAppointmentData(res);
            });
        }
    };

    const handleOpenFeedback = (appointment: any) => {
        setOpenFeedback(true);
        setAppointmentSelected(appointment);
    };

    const handleCloseFeedback = (isSubmit?: boolean) => {
        setOpenFeedback(false);
        setAppointmentSelected(null);
        if (isSubmit) {
            fetchData();
        }
    };

    return (
        <div className="h-[calc(100vh-48px-28px-40px-44px)] overflow-hidden bg-gray mt-[40px] w-full">
            <div className="text-center text-[20px] font-bold uppercase mb-[10px]">Appointments History</div>
            <div className="flex flex-wrap gap-[20px] overflow-y-auto h-[calc(100%-48px)]">
                {formattedAppointments.map((appointment: any) => (
                    <div className="w-[400px] bg-white" key={appointment.id}>
                        <Card>
                            <div className="flex flex-col p-4 border border-[#ccc] border-solid rounded-md h-[280px]">
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
                                    <div className="flex flex-col gap-y-1 flex-1 min-w-[200px]">
                                        <div className="flex gap-x-2" title="Hospital">
                                            <Images.GrOrganization className="text-[18px]" />
                                            <p>{appointment.organizationName}</p>
                                        </div>
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
                                        <div className="flex w-full pr-[10px] mt-auto items-center justify-end">
                                            <div className="flex-1 flex items-center gap-3 h-[32px] px-3 border border-gray-300 rounded-lg bg-gray-50 shadow-sm">
                                                <p className="flex-1 text-sm text-gray-700 italic truncate">
                                                    {appointment.feedback || 'No feedback yet'}
                                                </p>
                                                <Rating
                                                    value={appointment.rating || 0}
                                                    readOnly
                                                    size="small"
                                                    className="text-yellow-500"
                                                />
                                                <Button
                                                    onClick={() => handleOpenFeedback(appointment)}
                                                    variant="text"
                                                    color="primary"
                                                    className="p-1 min-w-[36px] rounded-md hover:bg-gray-200 transition"
                                                >
                                                    <EditIcon fontSize="small" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
            <FeedbackModal open={openFeedback} handleClose={(isSubmit?: boolean) => handleCloseFeedback(isSubmit)} />
        </div>
    );
};

export default AppointmentHistory;
