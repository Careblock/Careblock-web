import { useEffect, useState } from 'react';
import { addToast } from '@/components/base/toast/toast.service';
import useObservable from '@/hooks/use-observable.hook';
import { setTitle } from '@/utils/document';
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormHelperText,
    InputAdornment,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
} from '@mui/material';
import { Images } from '@/assets/images';
import { useFormik } from 'formik';
import { SystemMessage } from '@/constants/message.const';
import { FormMode } from '@/enums/FormMode';
import PopupConfirmDelete from '@/components/base/popup/popup-confirm-delete.component';
import { columns } from './time-slot.const';
import { INITIAL_TIME_SLOT_VALUES } from '@/constants/timeSlot.const';
import { timeSlotSchema } from '@/validations/timeSlot.validation';
import { TimeSlots } from '@/types/timeSlot.type';
import TimeSlotService from '@/services/timeSlot.service';
import ExaminationPackageService from '@/services/examinationPackage.service';
import { ExaminationPackages } from '@/types/examinationPackage.type';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { ToastPositionEnum } from '@/components/base/toast/toast.type';

function TimeSlot() {
    const { subscribeOnce } = useObservable();
    const [initialized, setInitialized] = useState(true);
    const [searchValue, setSearchValue] = useState<string>('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [timeSlots, setTimeSlots] = useState<any[]>([]);
    const [timeSlotsDisplays, setTimeSlotsDisplays] = useState<any[]>([]);
    const [isVisiblePopupAdd, setIsVisiblePopupAdd] = useState<boolean>(false);
    const [isVisiblePopupConfirm, setIsVisiblePopupConfirm] = useState<boolean>(false);
    const [mode, setMode] = useState<FormMode>(FormMode.Add);
    const [examinationPackage, setExaminationPackage] = useState<any[]>([]);
    const [startTime, setStartTime] = useState<Dayjs | null>();
    const [endTime, setEndTime] = useState<Dayjs | null>();

    const formik = useFormik({
        initialValues: INITIAL_TIME_SLOT_VALUES.INFORMATION,
        validationSchema: timeSlotSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        setTitle('Time slot | CareBlock');

        getExaminationPackage();
        getDatasource();
    }, []);

    useEffect(() => {
        if (!isVisiblePopupAdd) {
            formik.resetForm();
            setMode(FormMode.Add);
        }
    }, [isVisiblePopupAdd]);

    useEffect(() => {
        if (!initialized) {
            let result = timeSlots.filter((timeSlot: TimeSlots) => {
                if (timeSlot.examinationPackageName?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase())) {
                    return timeSlot;
                }
            });
            setTimeSlotsDisplays(result);
            setPage(0);
        } else setInitialized(false);
    }, [searchValue]);

    const getDatasource = () => {
        subscribeOnce(TimeSlotService.getAll(), (res: TimeSlots[]) => {
            if (res) {
                setTimeSlots(res);
                setTimeSlotsDisplays(res);
            }
        });
    };

    const getExaminationPackage = () => {
        subscribeOnce(ExaminationPackageService.getAll(), (res: ExaminationPackages[]) => {
            if (res) {
                setExaminationPackage(res);
            }
        });
    };

    const handleSearchValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClickEdit = (timeSlot: TimeSlots) => {
        setMode(FormMode.Update);
        formik.setFieldValue('id', timeSlot.id);
        formik.setFieldValue('startTime', timeSlot.startTime);
        setStartTime(dayjs(timeSlot.startTime, 'HH:mm'));
        formik.setFieldValue('endTime', timeSlot.endTime);
        setEndTime(dayjs(timeSlot.endTime, 'HH:mm'));
        formik.setFieldValue('period', timeSlot.period);
        setTimeout(() => {
            formik.setFieldValue('examinationPackageId', timeSlot.examinationPackageId);
        }, 0);
        setIsVisiblePopupAdd(true);
    };

    const handleClickRemove = (timeSlot: TimeSlots) => {
        formik.setFieldValue('id', timeSlot.id);
        setIsVisiblePopupConfirm(true);
    };

    const onClickAdd = () => {
        setIsVisiblePopupAdd(true);
    };

    const handleClosePopupAdd = () => {
        setIsVisiblePopupAdd(false);
    };

    const handleClosePopupDelete = () => {
        setIsVisiblePopupConfirm(false);
    };

    const handleConfirmDelete = () => {
        if (!formik.values?.id) return;
        subscribeOnce(TimeSlotService.delete(formik.values.id), (res: any) => {
            if (!res.isError) {
                setPage(0);
                getDatasource();
                setIsVisiblePopupConfirm(false);
                addToast({ text: SystemMessage.DELETE_TIME_SLOT, position: ToastPositionEnum.TopRight });
            }
        });
    };

    const resetForm = () => {
        formik.resetForm();
    };

    const handleSubmit = (values: TimeSlots) => {
        if (mode === FormMode.Add) {
            subscribeOnce(
                TimeSlotService.insert({
                    ...values,
                }),
                (res: any) => {
                    if (!res.isError) {
                        getDatasource();
                        resetForm();
                        setIsVisiblePopupAdd(false);
                        addToast({ text: SystemMessage.ADD_TIME_SLOT, position: ToastPositionEnum.TopRight });
                    }
                }
            );
        } else {
            if (!values?.id) return;
            subscribeOnce(
                TimeSlotService.update(values.id, {
                    ...values,
                }),
                (res: any) => {
                    if (!res.isError) {
                        getDatasource();
                        resetForm();
                        setIsVisiblePopupAdd(false);
                        addToast({ text: SystemMessage.EDIT_TIME_SLOT, position: ToastPositionEnum.TopRight });
                    }
                }
            );
        }
    };

    const handleChangeStartTime = (value: any) => {
        if (value?.$d) {
            const theDate = value.$d as Date;
            const result = `${theDate.getHours().toString().padStart(2, '0')}:${theDate.getMinutes().toString().padStart(2, '0')}`;
            if (result.includes('NaN')) {
                formik.setFieldError('startTime', 'Start time is invalid');
            } else {
                formik.setFieldError('startTime', '');
                formik.setFieldValue('startTime', result);
            }
        }
    };

    const handleChangeEndTime = (value: any) => {
        if (value?.$d) {
            const theDate = value.$d as Date;
            const result = `${theDate.getHours().toString().padStart(2, '0')}:${theDate.getMinutes().toString().padStart(2, '0')}`;
            if (result.includes('NaN')) {
                formik.setFieldError('endTime', 'Start time is invalid');
            } else {
                formik.setFieldError('endTime', '');
                formik.setFieldValue('endTime', result);
            }
        }
    };

    return (
        <div className="h-full w-[calc(100vw-270px-40px)]">
            <div className="text-[20px] leading-[20px] font-bold">Manage Time Slots</div>
            <div className="text-[16px] mb-[10px]">
                Set up all time slots that the organization conduct business from.
            </div>
            <div className="toolbar bg-[#f4f4f4] shadow-md rounded-t-md border w-full p-[16px] flex items-center justify-between">
                <TextField
                    variant="outlined"
                    label="Search"
                    size="medium"
                    placeholder="Enter examination package"
                    className="w-[300px]"
                    value={searchValue}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSearchValueChanged(event)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Images.SearchIcon className="!text-[28px]" />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button variant="contained" onClick={() => onClickAdd()}>
                    Add new
                </Button>
            </div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer className="max-h-[calc(100vh-52px-44px-30px-20px-34px-88px-52px)]">
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        <div className="font-bold uppercase">{column.label}</div>
                                    </TableCell>
                                ))}
                                <TableCell key="actions" align="center" style={{ minWidth: 150 }}>
                                    <div className="font-bold uppercase">Actions</div>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {timeSlotsDisplays
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((timeSlot: TimeSlots) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={timeSlot.id}>
                                            {columns.map((column) => {
                                                const value = timeSlot[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell key="action" align="center">
                                                <div className="flex items-center justify-center">
                                                    <Images.MdEdit
                                                        className="text-[30px] px-[6px] rounded-full hover:bg-[#ddd] cursor-pointer text-[black]"
                                                        onClick={() => handleClickEdit(timeSlot)}
                                                    />
                                                    <Images.MdDelete
                                                        className="text-[30px] px-[6px] rounded-full hover:bg-[#ddd] cursor-pointer text-[red]"
                                                        onClick={() => handleClickRemove(timeSlot)}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    className="border-t bg-[#f4f4f4]"
                    count={timeSlotsDisplays.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Popup Add */}
            <Dialog open={isVisiblePopupAdd} onClose={handleClosePopupAdd}>
                <DialogTitle>
                    <div className="flex items-center justify-between">
                        <p>{mode === FormMode.Add ? 'Add new time slot' : 'Update time slot'}</p>
                        <Images.MdCancel
                            className="cursor-pointer hover:text-[red] text-[26px]"
                            onClick={() => handleClosePopupAdd()}
                        />
                    </div>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit} className="w-[400px] flex flex-col gap-y-[10px]">
                        <div className="flex flex-col flex-1">
                            <div>Start time:</div>
                            <TimePicker
                                name="startTime"
                                value={startTime}
                                ampm={false}
                                onChange={handleChangeStartTime}
                            />
                            <FormHelperText>
                                <span className="text-[#d32f2f] mx-[14px]">{formik.errors.startTime as any}</span>
                            </FormHelperText>
                        </div>
                        <div className="flex flex-col flex-1">
                            <div>End time:</div>
                            <TimePicker name="endTime" value={endTime} ampm={false} onChange={handleChangeEndTime} />
                            <FormHelperText>
                                <span className="text-[#d32f2f] mx-[14px]">{formik.errors.endTime as any}</span>
                            </FormHelperText>
                        </div>
                        <div className="flex flex-col flex-1">
                            <div>Period:</div>
                            <TextField
                                id="period"
                                name="period"
                                placeholder="Period"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formik.values.period ?? ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.period && Boolean(formik.errors.period)}
                                helperText={formik.touched.period && formik.errors.period}
                            />
                        </div>
                        <div className="mt-[10px]">
                            <div>Examination Package:</div>
                            <Select
                                className="w-full"
                                name="examinationPackageId"
                                size="medium"
                                value={formik.values.examinationPackageId ?? ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.examinationPackageId && Boolean(formik.errors.examinationPackageId)
                                }
                            >
                                {examinationPackage.map((item: ExaminationPackages) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                                <span className="text-[#d32f2f] mx-[14px]">{formik.errors.examinationPackageId}</span>
                            </FormHelperText>
                        </div>
                        <div className="flex items-center justify-end mt-[16px] gap-x-[10px]">
                            <Button variant="text" color="inherit" onClick={handleClosePopupAdd}>
                                Cancel
                            </Button>
                            <Button variant="contained" type="submit">
                                {mode === FormMode.Add ? 'Add' : 'Update'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <PopupConfirmDelete
                isVisible={isVisiblePopupConfirm}
                onClickCancel={handleClosePopupDelete}
                onClickConfirm={handleConfirmDelete}
            />
        </div>
    );
}

export default TimeSlot;
