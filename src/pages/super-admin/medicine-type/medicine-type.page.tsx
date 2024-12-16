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
import { columns } from './medicine-type.const';
import { MedicineTypes } from '@/types/medicineType.type';
import MedicineTypeService from '@/services/medicineType.service';
import { medicineTypesSchema } from '@/validations/medicine.validation';
import { INITIAL_MEDICINE_TYPES_VALUES } from '@/constants/medicines.const';

function MedicineType() {
    const { subscribeOnce } = useObservable();
    const [initialized, setInitialized] = useState(true);
    const [searchValue, setSearchValue] = useState<string>('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [medicineTypes, setMedicineTypes] = useState<any[]>([]);
    const [medicineTypesDisplays, setMedicineTypesDisplays] = useState<any[]>([]);
    const [isVisiblePopupAdd, setIsVisiblePopupAdd] = useState<boolean>(false);
    const [isVisiblePopupConfirm, setIsVisiblePopupConfirm] = useState<boolean>(false);
    const [mode, setMode] = useState<FormMode>(FormMode.Add);

    const formik = useFormik({
        initialValues: INITIAL_MEDICINE_TYPES_VALUES.INFORMATION,
        validationSchema: medicineTypesSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        setTitle('Medicine Types | CareBlock');
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
            let result = medicineTypes.filter((medicineType: MedicineTypes) => {
                if (medicineType.name.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase())) {
                    return medicineType;
                }
            });
            setMedicineTypesDisplays(result);
        } else setInitialized(false);
    }, [searchValue]);

    const getDatasource = () => {
        subscribeOnce(MedicineTypeService.getAll(), (res: MedicineTypes[]) => {
            if (res) {
                setMedicineTypes(res);
                setMedicineTypesDisplays(res);
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

    const handleClickEdit = (medicineType: MedicineTypes) => {
        setMode(FormMode.Update);
        formik.setFieldValue('id', medicineType.id);
        formik.setFieldValue('name', medicineType.name);
        setIsVisiblePopupAdd(true);
    };

    const handleClickRemove = (medicineType: MedicineTypes) => {
        formik.setFieldValue('id', medicineType.id);
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
        subscribeOnce(MedicineTypeService.delete(formik.values.id), (res: any) => {
            if (!res.isError) {
                getDatasource();
                setIsVisiblePopupConfirm(false);
                addToast({ text: SystemMessage.DELETE_MEDICINE_TYPE, position: 'top-right' });
            }
        });
    };

    const resetForm = () => {
        formik.resetForm();
    };

    const handleSubmit = (values: MedicineTypes) => {
        if (mode === FormMode.Add) {
            subscribeOnce(
                MedicineTypeService.insert({
                    ...values,
                }),
                (res: any) => {
                    if (!res.isError) {
                        getDatasource();
                        resetForm();
                        setIsVisiblePopupAdd(false);
                        addToast({ text: SystemMessage.ADD_MEDICINE_TYPE, position: 'top-right' });
                    }
                }
            );
        } else {
            if (!values?.id) return;
            subscribeOnce(
                MedicineTypeService.update(values.id, {
                    ...values,
                }),
                (res: any) => {
                    if (!res.isError) {
                        getDatasource();
                        resetForm();
                        setIsVisiblePopupAdd(false);
                        addToast({ text: SystemMessage.EDIT_MEDICINE_TYPE, position: 'top-right' });
                    }
                }
            );
        }
    };

    return (
        <div className="h-full">
            <div className="text-[24px]">Manage Medicine Types</div>
            <div className="text-[16px] mb-4">
                Set up all medicine types that the organization conduct business from.
            </div>
            <div className="toolbar bg-[#f4f4f4] shadow-md rounded-t-md border w-full p-[16px] flex items-center justify-between">
                <TextField
                    variant="outlined"
                    label="Search"
                    size="small"
                    placeholder="Enter name"
                    className="w-[260px]"
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
                <Button variant="contained" onClick={() => onClickAdd()}>
                    Add new
                </Button>
            </div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer className="max-h-[calc(100vh-52px-52px-30px-24px-30px-72px-52px-26px)]">
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
                            {medicineTypesDisplays
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((medicineType: MedicineTypes) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={medicineType.id}>
                                            {columns.map((column) => {
                                                const value = medicineType[column.id];
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
                                                        onClick={() => handleClickEdit(medicineType)}
                                                    />
                                                    <Images.MdDelete
                                                        className="text-[30px] px-[6px] rounded-full hover:bg-[#ddd] cursor-pointer text-[red]"
                                                        onClick={() => handleClickRemove(medicineType)}
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
                    count={medicineTypesDisplays.length}
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
                        <p>Add new medicine type</p>
                        <Images.MdCancel
                            className="cursor-pointer hover:text-[red] text-[26px]"
                            onClick={() => handleClosePopupAdd()}
                        />
                    </div>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit} className="w-[400px] flex flex-col gap-y-[10px]">
                        <div className="flex flex-col w-full">
                            <div>Type:</div>
                            <TextField
                                id="name"
                                name="name"
                                placeholder="Medicine type"
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
                        <div className="flex items-center justify-end mt-[16px] gap-x-[10px]">
                            <Button variant="text" onClick={handleClosePopupAdd}>
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

export default MedicineType;