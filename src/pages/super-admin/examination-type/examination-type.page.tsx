import { useEffect, useState } from 'react';
import { addToast } from '@/components/base/toast/toast.service';
import useObservable from '@/hooks/use-observable.hook';
import { setTitle } from '@/utils/document';
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    InputAdornment,
    Paper,
    Table,
    TableBody,
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
import { INITIAL_EXAMINATION_TYPES_VALUES } from '@/constants/examinationPackage.const';
import { examinationTypesSchema } from '@/validations/examinationPackage.validation';
import DefaultThumbnail from '@/assets/images/common/package.jpg';
import ExaminationTypeService from '@/services/examinationType.service';
import { ExaminationTypes } from '@/types/examinationType.type';
import { columns } from './examination-type.const';
import { ToastPositionEnum } from '@/components/base/toast/toast.type';
import { useSelector } from 'react-redux';
import { GlobalState } from '@/stores/global.store';
import { StyledTableCell } from '@/constants/common.const';

function ExaminationType() {
    const { subscribeOnce } = useObservable();
    const [initialized, setInitialized] = useState(true);
    const collapsed = useSelector((state: GlobalState) => state.system.collapsed);
    const [searchValue, setSearchValue] = useState<string>('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [examinationTypes, setExaminationTypes] = useState<any[]>([]);
    const [examinationTypesDisplays, setExaminationTypesDisplays] = useState<any[]>([]);
    const [isVisiblePopupAdd, setIsVisiblePopupAdd] = useState<boolean>(false);
    const [isVisiblePopupConfirm, setIsVisiblePopupConfirm] = useState<boolean>(false);
    const [mode, setMode] = useState<FormMode>(FormMode.Add);
    const [examinationType, setExaminationType] = useState<any>();
    const [imageSrc, setImageSrc] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<any>();

    const formik = useFormik({
        initialValues: INITIAL_EXAMINATION_TYPES_VALUES.INFORMATION,
        validationSchema: examinationTypesSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        setTitle('Examination Types | CareBlock');
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
            let result = examinationTypes.filter((examinationType: ExaminationTypes) => {
                if (examinationType.name.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase())) {
                    return examinationType;
                }
            });
            setExaminationTypesDisplays(result);
            setPage(0);
        } else setInitialized(false);
    }, [searchValue]);

    const getDatasource = () => {
        subscribeOnce(ExaminationTypeService.getAll(), (res: ExaminationTypes[]) => {
            if (res) {
                setExaminationTypes(res);
                setExaminationTypesDisplays(res);
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

    const handleClickEdit = (examinationType: ExaminationTypes) => {
        setMode(FormMode.Update);
        setExaminationType(examinationType);
        formik.setFieldValue('id', examinationType.id);
        formik.setFieldValue('name', examinationType.name);
        formik.setFieldValue('thumbnail', examinationType.thumbnail);
        setIsVisiblePopupAdd(true);
    };

    const handleClickRemove = (examinationType: ExaminationTypes) => {
        formik.setFieldValue('id', examinationType.id);
        setIsVisiblePopupConfirm(true);
    };

    const onClickAdd = () => {
        setExaminationType(null);
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
        subscribeOnce(ExaminationTypeService.delete(formik.values.id), (res: any) => {
            if (!res.isError) {
                setPage(0);
                getDatasource();
                setIsVisiblePopupConfirm(false);
                addToast({ text: SystemMessage.DELETE_EXAMINATION_TYPE, position: ToastPositionEnum.TopRight });
            }
        });
    };

    const resetForm = () => {
        setImageSrc('');
        formik.resetForm();
    };

    const handleSubmit = (values: ExaminationTypes) => {
        if (mode === FormMode.Add) {
            subscribeOnce(
                ExaminationTypeService.insert({
                    ...values,
                    thumbnail: selectedFile ?? examinationType?.thumbnail,
                }),
                (res: any) => {
                    if (!res.isError) {
                        getDatasource();
                        resetForm();
                        setIsVisiblePopupAdd(false);
                        addToast({ text: SystemMessage.ADD_EXAMINATION_TYPE, position: ToastPositionEnum.TopRight });
                    }
                }
            );
        } else {
            if (!values?.id) return;
            subscribeOnce(
                ExaminationTypeService.update(values.id, {
                    ...values,
                    thumbnail: selectedFile ?? examinationType?.thumbnail,
                }),
                (res: any) => {
                    if (!res.isError) {
                        getDatasource();
                        resetForm();
                        setIsVisiblePopupAdd(false);
                        addToast({ text: SystemMessage.EDIT_EXAMINATION_TYPE, position: ToastPositionEnum.TopRight });
                    }
                }
            );
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const t = URL.createObjectURL(file);
            setImageSrc(t);
        }
    };

    return (
        <div className={`h-full w-[calc(100vw-${collapsed ? '70px' : '200px'}-40px)]`}>
            <div className="text-[20px] leading-[20px] font-bold">Manage Examination Types</div>
            <div className="text-[16px] mb-[10px]">
                Set up all examination types that the organization conduct business from.
            </div>
            <div className="toolbar bg-[#f4f4f4] shadow-md rounded-t-md border w-full p-[16px] flex items-center justify-between">
                <TextField
                    variant="outlined"
                    label="Search"
                    size="medium"
                    placeholder="Enter name"
                    className="w-[300px] bg-white"
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
                                    <StyledTableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        <div className="font-bold uppercase">{column.label}</div>
                                    </StyledTableCell>
                                ))}
                                <StyledTableCell key="actions" align="center" style={{ minWidth: 150 }}>
                                    <div className="font-bold uppercase">Actions</div>
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {examinationTypesDisplays
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((examinationType: ExaminationTypes) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={examinationType.id}>
                                            {columns.map((column) => {
                                                const value = examinationType[column.id];
                                                return (
                                                    <StyledTableCell key={column.id} align={column.align}>
                                                        {column.id === 'thumbnail' ? (
                                                            <img
                                                                src={value ? value : DefaultThumbnail}
                                                                alt="Thumbnail"
                                                                className="size-[60px] object-cover"
                                                            />
                                                        ) : column.format && typeof value === 'number' ? (
                                                            column.format(value)
                                                        ) : (
                                                            value
                                                        )}
                                                    </StyledTableCell>
                                                );
                                            })}
                                            <StyledTableCell key="action" align="center">
                                                <div className="flex items-center justify-center">
                                                    <Images.MdEdit
                                                        className="text-[34px] px-[6px] rounded-full hover:bg-[#ddd] cursor-pointer text-[black]"
                                                        onClick={() => handleClickEdit(examinationType)}
                                                    />
                                                    <Images.MdDelete
                                                        className="text-[34px] px-[6px] rounded-full hover:bg-[#ddd] cursor-pointer text-[red]"
                                                        onClick={() => handleClickRemove(examinationType)}
                                                    />
                                                </div>
                                            </StyledTableCell>
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
                    count={examinationTypesDisplays.length}
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
                        <p>{mode === FormMode.Add ? 'Add new examination type' : 'Update examination type'}</p>
                        <Images.MdCancel
                            className="cursor-pointer hover:text-[red] text-[26px]"
                            onClick={() => handleClosePopupAdd()}
                        />
                    </div>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit} className="w-[400px] flex flex-col gap-y-[10px]">
                        <div className="flex flex-col items-center mb-2">
                            <img
                                className={`${!imageSrc && !examinationType?.thumbnail && 'p-[8px]'} w-[80px] h-[80px] object-cover rounded-[175px] border shadow-xl`}
                                alt="thumbnail"
                                src={
                                    imageSrc
                                        ? imageSrc
                                        : examinationType?.thumbnail
                                          ? examinationType.thumbnail
                                          : DefaultThumbnail
                                }
                            />
                            <div className="my-3">
                                <label
                                    htmlFor="thumbnail"
                                    className="py-2 px-3 rounded-md shadow-xl block font-medium text-white cursor-pointer bg-blue-gray-300"
                                >
                                    Upload Thumbnail
                                </label>
                                <input
                                    id="thumbnail"
                                    name="thumbnail"
                                    type="file"
                                    accept="image/*"
                                    className="sr-only mt-1 focus:ring-blue-500 focus:border-blue-500 block shadow-sm border-gray-300 rounded"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col w-full">
                            <div>Type:</div>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                placeholder="Examination type"
                                type="text"
                                size="small"
                                variant="outlined"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
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

export default ExaminationType;
