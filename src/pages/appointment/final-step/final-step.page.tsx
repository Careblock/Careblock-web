import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useFormik } from 'formik';
import { MenuItem, Select, TextField } from '@mui/material';
import { FinalStepProps } from './final-step.type';
import { Images } from '@/assets/images';
import { setTitle } from '@/utils/document';
import { dropDownGenders } from '@/constants/dropdown.const';
import { getInitValue } from './final-step.const';
import { appoinmentCreateSchema } from '@/validations/appointment.validation';
import { convertSeparateToDateTime } from '@/utils/datetime.helper';
import { useNavigate } from 'react-router-dom';
import useObservable from '@/hooks/use-observable.hook';
import AppointmentService from '@/services/appointment.service';
import { APPOINTMENT_STATUS } from '@/enums/Appointment';
import { Appointments } from '@/types/appointment.type';
import { SystemMessage } from '@/constants/message.const';
import { addToast } from '@/components/base/toast/toast.service';
import { PATHS } from '@/enums/RoutePath';
import * as Yup from 'yup';
import { ToastPositionEnum } from '@/components/base/toast/toast.type';

const FinalStep = forwardRef(({ userData, extraData, organization, schedule }: FinalStepProps, ref) => {
    const navigate = useNavigate();
    const { subscribeOnce } = useObservable();

    useEffect(() => {
        setTitle('Final step | CareBlock');
    }, []);

    const formik = useFormik({
        initialValues: getInitValue(extraData),
        validationSchema: Yup.object().shape(appoinmentCreateSchema),
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useImperativeHandle(ref, () => ({
        onSubmitForm: () => {
            formik.submitForm();
        },
    }));

    const handleSubmit = (values: any) => {
        let { startDate, endDate } = convertSeparateToDateTime(schedule!);
        if (userData) {
            subscribeOnce(
                AppointmentService.insert({
                    patientId: userData.id,
                    reason: values?.reason,
                    status: APPOINTMENT_STATUS.ACTIVE,
                    organizationId: organization?.id,
                    examinationPackageId: schedule?.examinationPackage?.id,
                    address: values?.address,
                    email: values?.email,
                    gender: values?.gender,
                    name: values?.name,
                    phone: values?.phone,
                    endDateExpectation: endDate,
                    startDateExpectation: startDate,
                } as Appointments),
                (res: any) => {
                    addToast({ text: SystemMessage.MAKE_AN_APPOINTMENT_SUCCESS, position: ToastPositionEnum.TopRight });
                    setTimeout(() => {
                        res && navigate(PATHS.HOME);
                    }, 100);
                }
            );
        }
    };

    return (
        <div className="final-steps mt-5">
            <form onSubmit={formik.handleSubmit} className="w-full py-[12px] px-[20px] bg-white">
                <div className="final-steps__heading text-[20px] text-center uppercase font-bold mb-[20px]">
                    Scheduled appointment
                </div>
                <div className="final-steps__content border border-[#ddd] shadow-lg bg-white flex w-[680px] rounded-xl mx-auto py-6 px-8">
                    <div className="steps-content__left mr-[30px] flex flex-col items-center pr-8 w-[220px] border-r">
                        <div className="w-[70px] h-[70px] left-time__icon rounded-full border border-[#ddd] flex items-center justify-center mb-[10px]">
                            <Images.VaccinesIcon className="!text-[46px] font-light text-primary" />
                        </div>
                        <p className="uppercase text-primary mb-3 text-[18px] font-bold">Physical Exam</p>
                        <div className="content-left__time flex items-center mb-2 text-[18px]">
                            <Images.AccessTimeIcon className="!text-[22px]" />
                            <div className="left-time__text ml-1 text-[18px]">{schedule?.time}</div>
                        </div>
                        <div className="content-left__date flex items-center mb-2 text-[18px]">
                            <Images.CalendarMonthIcon className="!text-[22px]" />
                            <div className="left-date__text ml-1 text-[18px]">
                                {schedule?.date?.format('MM/DD/YYYY')}
                            </div>
                        </div>
                        <div className="content-right__hospital mb-2 justify-center flex items-center">
                            <Images.FaHospital className="!text-[22px]" />
                            <p className="ml-1 text-[18px]">{organization?.name}</p>
                        </div>
                        <div className="content-right__location justify-center mb-1 flex items-center">
                            <Images.FaMoneyBillWave className="!text-[22px]" />
                            <p className="ml-1 text-[18px]">{`$${schedule?.examinationPackage?.price!}`}</p>
                        </div>
                        <p className="text-[12px] mt-[10px] italic">({organization?.address})</p>
                    </div>
                    <div className="steps-content__right flex-1 flex flex-col items-center justify-between">
                        <div className="content-right__patient text-[16px] mb-1 flex w-full">
                            <b className="mr-1 text-[16px] w-[80px]">Patient:</b>
                            <TextField
                                className="rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto w-full"
                                name="name"
                                placeholder="Type value"
                                type="text"
                                size="small"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </div>
                        <div className="content-right__patient text-[16px] mb-1 flex w-full">
                            <b className="mr-1 text-[16px] w-[80px]">Gender:</b>
                            <Select
                                name="gender"
                                className="w-full"
                                size="small"
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.gender && Boolean(formik.errors.gender)}
                            >
                                {dropDownGenders.map((item) => (
                                    <MenuItem key={item.gender} value={item.gender}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        <div className="content-right__patient text-[16px] mb-1 flex w-full">
                            <b className="mr-1 text-[16px] w-[80px]">Phone:</b>
                            <TextField
                                name="phone"
                                className="w-full rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                placeholder="Type value"
                                type="text"
                                size="small"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.phone && Boolean(formik.errors.phone)}
                                helperText={formik.touched.phone && formik.errors.phone}
                            />
                        </div>
                        <div className="content-right__patient text-[16px] mb-1 flex w-full">
                            <b className="mr-1 text-[16px] w-[80px]">Email:</b>
                            <TextField
                                name="email"
                                className="w-full rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                placeholder="Type value"
                                type="text"
                                size="small"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </div>
                        <div className="content-right__patient text-[16px] mb-1 flex w-full">
                            <b className="mr-1 text-[16px] w-[80px]">Address:</b>
                            <TextField
                                name="address"
                                className="w-full rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                placeholder="Type value"
                                type="text"
                                size="small"
                                value={formik.values.address ?? ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.address && Boolean(formik.errors.address)}
                                helperText={formik.touched.address && formik.errors.address}
                            />
                        </div>
                        <div className="content-right__reason flex w-full">
                            <b className="mr-1 text-[16px] w-[80px]">Reason:</b>
                            <TextField
                                name="reason"
                                className="w-full rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                placeholder="Type value"
                                type="text"
                                size="small"
                                // multiline
                                // maxRows={5}
                                value={formik.values.reason}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.reason && Boolean(formik.errors.reason)}
                                helperText={formik.touched.reason && formik.errors.reason}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
});

FinalStep.displayName = 'FinalStep';

export default FinalStep;
