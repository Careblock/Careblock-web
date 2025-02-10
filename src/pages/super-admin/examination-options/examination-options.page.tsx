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
import { columns } from './examination-options.const';
import { INITIAL_EXAMINATION_OPTION_VALUES } from '@/constants/examinationOption.const';
import { examinationOptionsSchema } from '@/validations/examinationOption.validation';
import { ExaminationOptions } from '@/types/examinationOption.type';
import ExaminationOptionService from '@/services/examinationOption.service';
import SpecialistService from '@/services/specialist.service';
import { Specialists } from '@/types/specialist.type';
import { ToastPositionEnum } from '@/components/base/toast/toast.type';
import { GlobalState } from '@/stores/global.store';
import { useSelector } from 'react-redux';

function ExaminationOption() {
    const { subscribeOnce } = useObservable();
    const [initialized, setInitialized] = useState(true);
    const collapsed = useSelector((state: GlobalState) => state.system.collapsed);
    const [searchValue, setSearchValue] = useState<string>('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [examinationOptions, setExaminationOptions] = useState<any[]>([]);
    const [examinationOptionsDisplays, setExaminationOptionsDisplays] = useState<any[]>([]);
    const [isVisiblePopupAdd, setIsVisiblePopupAdd] = useState<boolean>(false);
    const [isVisiblePopupConfirm, setIsVisiblePopupConfirm] = useState<boolean>(false);
    const [mode, setMode] = useState<FormMode>(FormMode.Add);
    const [specialist, setSpecialist] = useState<any[]>([]);

    const formik = useFormik({
        initialValues: INITIAL_EXAMINATION_OPTION_VALUES.INFORMATION,
        validationSchema: examinationOptionsSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        setTitle('Examination Options | CareBlock');

        getSpecialist();
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
            let result = examinationOptions.filter((examinationOption: ExaminationOptions) => {
                if (
                    examinationOption.name.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    examinationOption.description?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    examinationOption.specialistName?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase())
                ) {
                    return examinationOption;
                }
            });
            setExaminationOptionsDisplays(result);
            setPage(0);
        } else setInitialized(false);
    }, [searchValue]);

    const getDatasource = () => {
        subscribeOnce(ExaminationOptionService.getAll(), (res: ExaminationOptions[]) => {
            if (res) {
                setExaminationOptions(res);
                setExaminationOptionsDisplays(res);
            }
        });
    };

    const getSpecialist = () => {
        subscribeOnce(SpecialistService.getAll(), (res: Specialists[]) => {
            if (res) {
                setSpecialist(res);
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

    const handleClickEdit = (examinationOption: ExaminationOptions) => {
        setMode(FormMode.Update);
        formik.setFieldValue('id', examinationOption.id);
        formik.setFieldValue('name', examinationOption.name);
        formik.setFieldValue('description', examinationOption.description);
        formik.setFieldValue('price', examinationOption.price);
        formik.setFieldValue('timeEstimation', examinationOption.timeEstimation);
        setTimeout(() => {
            formik.setFieldValue('specialistId', examinationOption.specialistId);
        }, 0);
        setIsVisiblePopupAdd(true);
    };

    const handleClickRemove = (examinationOption: ExaminationOptions) => {
        formik.setFieldValue('id', examinationOption.id);
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
        subscribeOnce(ExaminationOptionService.delete(formik.values.id), (res: any) => {
            if (!res.isError) {
                setPage(0);
                getDatasource();
                setIsVisiblePopupConfirm(false);
                addToast({ text: SystemMessage.DELETE_EXAMINATION_OPTION, position: ToastPositionEnum.TopRight });
            }
        });
    };

    const resetForm = () => {
        formik.resetForm();
    };

    const handleSubmit = (values: ExaminationOptions) => {
        if (mode === FormMode.Add) {
            subscribeOnce(
                ExaminationOptionService.insert({
                    ...values,
                }),
                (res: any) => {
                    if (!res.isError) {
                        getDatasource();
                        resetForm();
                        setIsVisiblePopupAdd(false);
                        addToast({ text: SystemMessage.ADD_EXAMINATION_OPTION, position: ToastPositionEnum.TopRight });
                    }
                }
            );
        } else {
            if (!values?.id) return;
            subscribeOnce(
                ExaminationOptionService.update(values.id, {
                    ...values,
                }),
                (res: any) => {
                    if (!res.isError) {
                        getDatasource();
                        resetForm();
                        setIsVisiblePopupAdd(false);
                        addToast({ text: SystemMessage.EDIT_EXAMINATION_OPTION, position: ToastPositionEnum.TopRight });
                    }
                }
            );
        }
    };

    return (
        <div className={`h-full w-[calc(100vw-${collapsed ? '70px' : '200px'}-40px)]`}>
            <div className="text-[20px] leading-[20px] font-bold">Manage Examination Options</div>
            <div className="text-[16px] mb-[10px]">
                Set up all examination options that the organization conduct business from.
            </div>
            <div className="toolbar bg-[#f4f4f4] shadow-md rounded-t-md border w-full p-[16px] flex items-center justify-between">
                <TextField
                    variant="outlined"
                    label="Search"
                    size="medium"
                    placeholder="Enter name"
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
                <TableContainer className="max-h-[calc(100vh-52px-30px-20px-34px-88px-52px)]">
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
                            {examinationOptionsDisplays
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((examinationOption: ExaminationOptions) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={examinationOption.id}>
                                            {columns.map((column) => {
                                                const value = examinationOption[column.id];
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
                                                        onClick={() => handleClickEdit(examinationOption)}
                                                    />
                                                    <Images.MdDelete
                                                        className="text-[30px] px-[6px] rounded-full hover:bg-[#ddd] cursor-pointer text-[red]"
                                                        onClick={() => handleClickRemove(examinationOption)}
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
                    count={examinationOptionsDisplays.length}
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
                        <p>{mode === FormMode.Add ? 'Add new examination option' : 'Update examination option'}</p>
                        <Images.MdCancel
                            className="cursor-pointer hover:text-[red] text-[26px]"
                            onClick={() => handleClosePopupAdd()}
                        />
                    </div>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit} className="w-[400px] flex flex-col gap-y-[10px]">
                        <div className="flex flex-col w-full">
                            <div>Name:</div>
                            <TextField
                                id="name"
                                name="name"
                                placeholder="Option name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </div>
                        <div className="flex flex-col flex-1">
                            <div>Description:</div>
                            <TextField
                                id="description"
                                name="description"
                                placeholder="Description"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formik.values.description ?? ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                            />
                        </div>
                        <div className="flex flex-col flex-1">
                            <div>Price:</div>
                            <TextField
                                id="price"
                                name="price"
                                placeholder="Price"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formik.values.price ?? ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.price && Boolean(formik.errors.price)}
                                helperText={formik.touched.price && formik.errors.price}
                            />
                        </div>
                        <div className="flex flex-col flex-1">
                            <div>Time Estimation:</div>
                            <TextField
                                id="timeEstimation"
                                name="timeEstimation"
                                placeholder="Time Estimation"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formik.values.timeEstimation ?? ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.timeEstimation && Boolean(formik.errors.timeEstimation)}
                                helperText={formik.touched.timeEstimation && formik.errors.timeEstimation}
                            />
                        </div>
                        <div>
                            <div>Specialist:</div>
                            <Select
                                className="w-full"
                                name="specialistId"
                                size="medium"
                                value={formik.values.specialistId ?? ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.specialistId && Boolean(formik.errors.specialistId)}
                            >
                                {specialist.map((item: Specialists) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                                <span className="text-[#d32f2f] mx-[14px]">{formik.errors.specialistId}</span>
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

export default ExaminationOption;
