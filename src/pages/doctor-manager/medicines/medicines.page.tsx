import { useEffect, useState } from 'react';
import { AuthContextType } from '@/types/auth.type';
import { addToast } from '@/components/base/toast/toast.service';
import useObservable from '@/hooks/use-observable.hook';
import { useAuth } from '@/contexts/auth.context';
import { setTitle } from '@/utils/document';
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
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
import PopupConfirm from '@/components/base/popup/popup-confirm.component';
import { columns } from './medicines.const';
import DefaultThumbnail from '@/assets/images/common/package.jpg';
import { INITIAL_MEDICINES_VALUES, UnitPriceOptions } from '@/constants/medicines.const';
import { medicinesSchema } from '@/validations/medicine.validation';
import { type Medicines } from '@/types/medicine.type';
import MedicineService from '@/services/medicine.service';
import MedicineTypeService from '@/services/medicineType.service';
import { MedicineTypes } from '@/types/medicineType.type';
import { UnitPrice, UnitPriceName } from '@/enums/UnitPrice';
import { ToastPositionEnum, ToastStatusEnum } from '@/components/base/toast/toast.type';
import { useSelector } from 'react-redux';
import { GlobalState } from '@/stores/global.store';
import { StyledTableCell } from '@/constants/common.const';
import Nodata from '@/components/base/no-data/nodata.component';

function Medicines() {
    const { subscribeOnce } = useObservable();
    const collapsed = useSelector((state: GlobalState) => state.system.collapsed);
    const { userData } = useAuth() as AuthContextType;
    const [initialized, setInitialized] = useState(true);
    const [searchValue, setSearchValue] = useState<string>('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [medicines, setMedicines] = useState<any[]>([]);
    const [medicinesDisplays, setMedicinesDisplays] = useState<any[]>([]);
    const [isVisiblePopupAdd, setIsVisiblePopupAdd] = useState<boolean>(false);
    const [isVisiblePopupConfirm, setIsVisiblePopupConfirm] = useState<boolean>(false);
    const [mode, setMode] = useState<FormMode>(FormMode.Add);
    const [medicine, setMedicine] = useState<any>();
    const [imageSrc, setImageSrc] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<any>();
    const [medicineTypes, setMedicineTypes] = useState<any[]>([]);

    const formik = useFormik({
        initialValues: INITIAL_MEDICINES_VALUES.INFORMATION,
        validationSchema: medicinesSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        setTitle('Medicines | CareBlock');
        getDatasource();
        getMedicineType();
    }, []);

    useEffect(() => {
        if (!isVisiblePopupAdd) {
            formik.resetForm();
            setMode(FormMode.Add);
        } else {
            formik.setFieldValue('unitPrice', UnitPrice.USD);
        }
    }, [isVisiblePopupAdd]);

    useEffect(() => {
        if (!initialized) {
            let result = medicines.filter((medicine: Medicines) => {
                if (
                    medicine.name.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) ||
                    medicine.description?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase())
                ) {
                    return medicine;
                }
            });
            setMedicinesDisplays(result);
            setPage(0);
        } else setInitialized(false);
    }, [searchValue]);

    const getUnitPriceName = (unitPrice: UnitPrice) => {
        if (unitPrice === UnitPrice.USD) return UnitPriceName.USD;
        if (unitPrice === UnitPrice.VND) return UnitPriceName.VND;
    };

    const getDatasource = () => {
        if (!userData?.id) return;
        subscribeOnce(MedicineService.getByOrganization(userData.id), (res: Medicines[]) => {
            if (res) {
                const theData = res.map((item: Medicines) => {
                    return {
                        ...item,
                        unitPriceName: getUnitPriceName(item.unitPrice),
                    };
                });
                setMedicines(theData);
                setMedicinesDisplays(theData);
            }
        });
    };

    const getMedicineType = () => {
        subscribeOnce(MedicineTypeService.getAll(), (res: MedicineTypes[]) => {
            if (res) {
                setMedicineTypes(res);
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

    const handleClickEdit = (medicine: Medicines) => {
        setMode(FormMode.Update);
        setMedicine(medicine);
        formik.setFieldValue('id', medicine.id);
        formik.setFieldValue('name', medicine.name);
        formik.setFieldValue('thumbnail', medicine.thumbnail);
        formik.setFieldValue('price', medicine.price);
        formik.setFieldValue('unitPrice', medicine.unitPrice);
        formik.setFieldValue('description', medicine.description ?? '');
        if (medicine.medicineTypeId) formik.setFieldValue('medicineTypeId', medicine.medicineTypeId);
        setIsVisiblePopupAdd(true);
    };

    const handleClickRemove = (medicine: Medicines) => {
        formik.setFieldValue('id', medicine.id);
        setIsVisiblePopupConfirm(true);
    };

    const onClickAdd = () => {
        setMedicine(null);
        setIsVisiblePopupAdd(true);
    };

    const handleClosePopupAdd = () => {
        setIsVisiblePopupAdd(false);
    };

    const handleClosePopupDelete = () => {
        setIsVisiblePopupConfirm(false);
    };

    const handleChangeMedicineType = ($event: any) => {
        formik.setFieldValue('medicineTypeId', $event.target.value);
    };

    const handleChangeUnitPrice = ($event: any) => {
        formik.setFieldValue('unitPrice', $event.target.value);
    };

    const handleConfirmDelete = () => {
        if (!formik.values?.id) return;
        subscribeOnce(MedicineService.delete(formik.values.id), (res: any) => {
            if (!res.isError) {
                setPage(0);
                getDatasource();
                setIsVisiblePopupConfirm(false);
                addToast({ text: SystemMessage.DELETE_MEDICINE, position: ToastPositionEnum.TopRight });
            }
        });
    };

    const resetForm = () => {
        setImageSrc('');
        formik.resetForm();
    };

    const handleSubmit = (values: Medicines) => {
        if (mode === FormMode.Add) {
            if (!values.medicineTypeId) {
                addToast({
                    text: SystemMessage.MEDICINE_TYPE_REQUIRED,
                    position: ToastPositionEnum.TopRight,
                    status: ToastStatusEnum.InValid,
                });
                return;
            }
            if (!userData?.id) return;
            subscribeOnce(
                MedicineService.insert(
                    {
                        ...values,
                        isDeleted: false,
                        thumbnail: selectedFile ?? medicine?.thumbnail,
                    },
                    userData.id
                ),
                (res: any) => {
                    if (!res.isError) {
                        getDatasource();
                        resetForm();
                        setIsVisiblePopupAdd(false);
                        addToast({ text: SystemMessage.ADD_MEDICINE, position: ToastPositionEnum.TopRight });
                    }
                }
            );
        } else {
            if (!values?.id) return;
            subscribeOnce(
                MedicineService.update(values.id, {
                    ...values,
                    isDeleted: false,
                    thumbnail: selectedFile ?? medicine?.thumbnail,
                }),
                (res: any) => {
                    if (!res.isError) {
                        getDatasource();
                        resetForm();
                        setIsVisiblePopupAdd(false);
                        addToast({ text: SystemMessage.EDIT_MEDICINE, position: ToastPositionEnum.TopRight });
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
            <div className="text-[20px] leading-[20px] font-bold">Manage Medicines</div>
            <div className="text-[16px] mb-[10px]">
                Set up all medicines that your organization conduct business from.
            </div>
            <div className="toolbar bg-[#f4f4f4] shadow-md rounded-t-md border w-full p-[16px] flex items-center justify-between">
                <TextField
                    variant="outlined"
                    label="Search"
                    size="medium"
                    placeholder="Enter name or description"
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
                            {medicinesDisplays.length ? (
                                medicinesDisplays
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((medicine: Medicines) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={medicine.id}>
                                                {columns.map((column) => {
                                                    const value = medicine[column.id];
                                                    return (
                                                        <StyledTableCell key={column.id} align={column.align}>
                                                            {column.id === 'thumbnail' ? (
                                                                <img
                                                                    src={value ? `${value}` : DefaultThumbnail}
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
                                                            onClick={() => handleClickEdit(medicine)}
                                                        />
                                                        <Images.MdDelete
                                                            className="text-[34px] px-[6px] rounded-full hover:bg-[#ddd] cursor-pointer text-[red]"
                                                            onClick={() => handleClickRemove(medicine)}
                                                        />
                                                    </div>
                                                </StyledTableCell>
                                            </TableRow>
                                        );
                                    })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        <div className="w-full flex items-center justify-center">
                                            <div className="w-[200px]">
                                                <Nodata />
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    className="border-t bg-[#f4f4f4]"
                    count={medicinesDisplays.length}
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
                        <p>{mode === FormMode.Add ? 'Add new medicine' : 'Update medicine'}</p>
                        <Images.MdCancel
                            className="cursor-pointer hover:text-[red] text-[26px]"
                            onClick={() => handleClosePopupAdd()}
                        />
                    </div>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit} className="w-auto flex flex-col gap-y-[10px] overflow-hidden">
                        <div className="flex flex-col items-center mb-2 w-[552px]">
                            <img
                                className={`${!imageSrc && !medicine?.thumbnail && 'p-[8px]'} w-[80px] h-[80px] object-cover rounded-[175px] border shadow-xl`}
                                alt="thumbnail"
                                src={imageSrc ? imageSrc : medicine?.thumbnail ? medicine.thumbnail : DefaultThumbnail}
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
                        <div className="flex flex-col flex-1">
                            <div>Medicine name:</div>
                            <TextField
                                id="name"
                                name="name"
                                placeholder="Medicine name"
                                type="text"
                                fullWidth
                                size="small"
                                variant="outlined"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <div>Description:</div>
                            <TextField
                                id="description"
                                name="description"
                                placeholder="Description"
                                type="text"
                                fullWidth
                                size="small"
                                variant="outlined"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                            />
                        </div>
                        <div className="flex items-center justify-between gap-x-[16px]">
                            <div className="flex flex-col w-full">
                                <div>Price:</div>
                                <TextField
                                    id="price"
                                    name="price"
                                    placeholder="Price"
                                    type="number"
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.price && Boolean(formik.errors.price)}
                                    helperText={formik.touched.price && formik.errors.price}
                                />
                            </div>
                            <div className="flex flex-col w-full">
                                <div>Unit Price:</div>
                                <Select
                                    className="w-full"
                                    size="small"
                                    displayEmpty
                                    value={formik.values.unitPrice ?? ''}
                                    onChange={($event: any) => handleChangeUnitPrice($event)}
                                >
                                    {UnitPriceOptions.map((item: any) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-col w-full">
                            <div>Medicine type:</div>
                            <Select
                                className="w-full"
                                size="small"
                                displayEmpty
                                value={formik.values.medicineTypeId ?? ''}
                                onChange={($event: any) => handleChangeMedicineType($event)}
                            >
                                {medicineTypes.map((item: any) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
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

            <PopupConfirm
                isVisible={isVisiblePopupConfirm}
                onClickCancel={handleClosePopupDelete}
                onClickConfirm={handleConfirmDelete}
            />
        </div>
    );
}

export default Medicines;
